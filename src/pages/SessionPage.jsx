import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { motion, AnimatePresence } from "framer-motion";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { useNotes } from "../hooks/useNotes";
import QuickNotes from "../components/QuickNotes";
import CombatSetupOverlay from "../components/CombatSetupOverlay";
import { usePlayers } from "../hooks/usePlayers";
import CombatTracker from "../components/CombatTracker";
import CombatStatBlock from "../components/CombatStatBlock";

// Toolbar button component
function ToolbarButton({ onClick, active, children, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`px-3 py-1.5 text-sm transition-colors duration-150 ${
        active
          ? "text-[#c9a84c] bg-[#1e1e3a]"
          : "text-[#8a8a9a] hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

// Leave confirmation overlay
function LeaveConfirmation({ onStay, onLeave }) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-[#12122a] border border-[#c9a84c] p-8 max-w-sm w-full flex flex-col gap-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div>
          <h2 className="text-xl font-bold text-[#c9a84c] uppercase tracking-widest">
            Leave Session?
          </h2>
          <p className="text-[#8a8a9a] text-sm mt-2">
            Your notes are saved automatically. You can return to this session
            at any time.
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={onStay}
            className="flex-1 bg-[#c9a84c] text-[#12122a] py-3 uppercase tracking-widest text-sm font-bold hover:bg-white transition-all duration-300"
          >
            Stay
          </button>
          <button
            onClick={onLeave}
            className="flex-1 border border-[#3a3a5a] text-[#8a8a9a] py-3 uppercase tracking-widest text-sm hover:border-white hover:text-white transition-all duration-300"
          >
            Leave
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function SessionPage() {
  const { campaignId, sessionId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [sessionData, setSessionData] = useState(null);
  const [saveStatus, setSaveStatus] = useState("saved"); // "saved" | "saving" | "unsaved"
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [saveTimeout, setSaveTimeout] = useState(null);
  const {
    notes,
    loading: notesLoading,
    addNote,
    deleteNote,
  } = useNotes(user?.uid, campaignId, sessionId);
  const { activePlayers } = usePlayers(user?.uid, campaignId);
  const [showCombatSetup, setShowCombatSetup] = useState(false);
  const [combatMode, setCombatMode] = useState(false);
  const [combatants, setCombatants] = useState([]);
  const [selectedCombatant, setSelectedCombatant] = useState(null);

  const handleBeginCombat = (newCombatants) => {
    setShowCombatSetup(false);
    setCombatants(newCombatants);
    setCombatMode(true);
  };

  // Fetch session data on mount
  useEffect(() => {
    if (!user?.uid || !campaignId || !sessionId) return;
    const ref = doc(
      db,
      "users",
      user.uid,
      "campaigns",
      campaignId,
      "sessions",
      sessionId,
    );
    getDoc(ref).then((snap) => {
      if (snap.exists()) setSessionData({ id: snap.id, ...snap.data() });
    });
  }, [user, campaignId, sessionId]);

  // Save to Firestore
  const saveContent = useCallback(
    async (content) => {
      if (!user?.uid) return;
      setSaveStatus("saving");
      const ref = doc(
        db,
        "users",
        user.uid,
        "campaigns",
        campaignId,
        "sessions",
        sessionId,
      );
      await updateDoc(ref, {
        editorContent: content,
        lastSaved: serverTimestamp(),
      });
      setSaveStatus("saved");
    },
    [user, campaignId, sessionId],
  );

  // TipTap editor
  const editor = useEditor({
    extensions: [StarterKit],
    content: sessionData?.editorContent ?? "",
    editorProps: {
      attributes: {
        class:
          "outline-none min-h-full text-white prose prose-invert max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      setSaveStatus("unsaved");
      // Debounce — save 1.5 seconds after user stops typing
      if (saveTimeout) clearTimeout(saveTimeout);
      const timeout = setTimeout(() => {
        saveContent(editor.getJSON());
      }, 1500);
      setSaveTimeout(timeout);
    },
  });

  // Load saved content into editor once fetched
  useEffect(() => {
    if (editor && sessionData?.editorContent) {
      editor.commands.setContent(sessionData.editorContent);
    }
  }, [sessionData, editor]);

  const handleBack = () => setShowLeaveConfirm(true);
  const handleStay = () => setShowLeaveConfirm(false);
  const handleLeave = () => navigate(`/campaign/${campaignId}`);

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex flex-col">
      {/* Top bar */}
      <div className="h-16 border-b border-[#1e1e3a] flex items-center justify-between px-8 shrink-0">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="text-[#8a8a9a] hover:text-[#c9a84c] uppercase tracking-widest text-xs transition-colors flex items-center gap-2"
        >
          ← Backs
        </button>

        {/* Session name */}
        <div className="flex flex-col items-center">
          <span className="text-white font-bold uppercase tracking-widest text-sm">
            {sessionData?.name ?? "Session"}
          </span>
          <span className="text-[#8a8a9a] text-xs">#{sessionData?.number}</span>
        </div>

        {/* Right side — save status + combat button placeholder */}
        <div className="flex items-center gap-6">
          <span
            className={`text-xs uppercase tracking-widest transition-colors ${
              saveStatus === "saved"
                ? "text-green-500/50"
                : saveStatus === "saving"
                  ? "text-[#c9a84c]/70"
                  : "text-[#8a8a9a]"
            }`}
          >
            {saveStatus === "saved"
              ? "✓ Saved"
              : saveStatus === "saving"
                ? "Saving..."
                : "Unsaved"}
          </span>

          {!combatMode ? (
            <button
              onClick={() => setShowCombatSetup(true)}
              className="border border-[#c9a84c] text-[#c9a84c] px-4 py-2 text-xs uppercase tracking-widest hover:bg-[#c9a84c] hover:text-[#12122a] transition-all duration-300"
            >
              ⚔ Enter Combat
            </button>
          ) : (
            <button
              onClick={() => {
                if (window.confirm("End combat?")) setCombatMode(false);
              }}
              className="border border-red-500/50 text-red-400 px-4 py-2 text-xs uppercase tracking-widest hover:bg-red-500/10 transition-all duration-300"
            >
              ✕ End Combat
            </button>
          )}
        </div>
      </div>

      {/* Toolbar */}
      {editor && !combatMode && (
        <div className="border-b border-[#1e1e3a] flex items-center gap-1 px-8 py-1 shrink-0">
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            active={editor.isActive("heading", { level: 1 })}
            title="Heading 1"
          >
            H1
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            active={editor.isActive("heading", { level: 2 })}
            title="Heading 2"
          >
            H2
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            active={editor.isActive("heading", { level: 3 })}
            title="Heading 3"
          >
            H3
          </ToolbarButton>
          <div className="w-px h-5 bg-[#1e1e3a] mx-1" />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="Bold"
          >
            B
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="Italic"
          >
            I
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
            title="Strikethrough"
          >
            S
          </ToolbarButton>
          <div className="w-px h-5 bg-[#1e1e3a] mx-1" />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            title="Bullet list"
          >
            • List
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            title="Numbered list"
          >
            1. List
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
            title="Blockquote"
          >
            " Quote
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={editor.isActive("codeBlock")}
            title="Code block"
          >
            {"</>"}
          </ToolbarButton>
          <div className="w-px h-5 bg-[#1e1e3a] mx-1" />
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            title="Undo"
          >
            ↩
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            title="Redo"
          >
            ↪
          </ToolbarButton>
        </div>
      )}

      {/* Editor + Quick Notes / Combat */}
      <div className="flex-1 overflow-hidden flex gap-4 p-4">
        {/* Left area — editor or empty in combat */}
        {!combatMode && (
          <div className="flex-[7] overflow-y-auto bg-[#12122a] border border-[#1e1e3a] px-12 py-10">
            <EditorContent editor={editor} className="min-h-full" />
          </div>
        )}

        {combatMode && <CombatStatBlock combatant={selectedCombatant} />}

        {combatMode && (
          <CombatTracker
            combatants={combatants}
            onEndCombat={() => {
              setCombatMode(false);
              setSelectedCombatant(null);
            }}
            onSelectCombatant={setSelectedCombatant}
            selectedCombatantId={
              selectedCombatant?.instanceId ?? selectedCombatant?.id
            }
          />
        )}

        {/* Right — Quick Notes or Combat Tracker */}
        {!combatMode && (
          <div className="flex-[3] overflow-hidden flex flex-col">
            <QuickNotes
              notes={notes}
              loading={notesLoading}
              onAdd={addNote}
              onDelete={deleteNote}
            />
          </div>
        )}
      </div>

      {/* Leave confirmation */}
      <AnimatePresence>
        {showLeaveConfirm && (
          <LeaveConfirmation onStay={handleStay} onLeave={handleLeave} />
        )}
      </AnimatePresence>
      <CombatSetupOverlay
        isOpen={showCombatSetup}
        onClose={() => setShowCombatSetup(false)}
        onBegin={handleBeginCombat}
        players={activePlayers}
      />
    </div>
  );
}
