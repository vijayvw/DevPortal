import {
  EditorContent,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
} from "react";

export interface RichTextEditorRef {
  insertImage: (url: string) => void;
}

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onInsertImage?: () => void;
}

const RichTextEditor = forwardRef<
  RichTextEditorRef,
  RichTextEditorProps
>(({ value, onChange, onInsertImage }, ref) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ],

    content: value,

    editorProps: {
      attributes: {
        class:
          "editor-content prose prose-invert max-w-none min-h-[400px] rounded-lg border border-neutral-700 bg-neutral-900 p-6 text-white focus:outline-none",
      },
    },

    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useImperativeHandle(
    ref,
    () => ({
      insertImage(url: string) {
        if (!editor) return;
        const result = editor
          .chain()
          .focus()
          .setImage({
            src: url,
          })
          .run();

      }
    }),
    [editor]
  );

  useEffect(() => {
    if (!editor) return;

    if (value !== editor.getHTML()) {
      editor.commands.setContent(value, {
        emitUpdate: false,
      });
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 rounded-lg border border-neutral-700 bg-neutral-900 p-3">
        <button
          type="button"
          onClick={onInsertImage}
          className="rounded bg-neutral-800 px-3 py-1 text-gray-300 hover:bg-neutral-700"
        >
          Image
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded px-3 py-1 transition ${
            editor.isActive("bold")
              ? "bg-blue-600 text-white"
              : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
          }`}
        >
          Bold
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded px-3 py-1 transition ${
            editor.isActive("italic")
              ? "bg-blue-600 text-white"
              : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
          }`}
        >
          Italic
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`rounded px-3 py-1 transition ${
            editor.isActive("heading", { level: 1 })
              ? "bg-blue-600 text-white"
              : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
          }`}
        >
          H1
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`rounded px-3 py-1 transition ${
            editor.isActive("heading", { level: 2 })
              ? "bg-blue-600 text-white"
              : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
          }`}
        >
          H2
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleBulletList().run()
          }
          className={`rounded px-3 py-1 transition ${
            editor.isActive("bulletList")
              ? "bg-blue-600 text-white"
              : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
          }`}
        >
          • List
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
          className={`rounded px-3 py-1 transition ${
            editor.isActive("orderedList")
              ? "bg-blue-600 text-white"
              : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
          }`}
        >
          1.
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleCodeBlock().run()
          }
          className={`rounded px-3 py-1 transition ${
            editor.isActive("codeBlock")
              ? "bg-blue-600 text-white"
              : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
          }`}
        >
          Code
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleBlockquote().run()
          }
          className={`rounded px-3 py-1 transition ${
            editor.isActive("blockquote")
              ? "bg-blue-600 text-white"
              : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
          }`}
        >
          Quote
        </button>

        <button
          type="button"
          onClick={() => {
            const url = prompt("Enter URL");

            if (!url) return;

            editor
              .chain()
              .focus()
              .setLink({
                href: url,
              })
              .run();
          }}
          className={`rounded px-3 py-1 transition ${
            editor.isActive("link")
              ? "bg-blue-600 text-white"
              : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"
          }`}
        >
          Link
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().undo().run()
          }
          disabled={!editor.can().undo()}
          className="rounded bg-neutral-800 px-3 py-1 text-gray-300 hover:bg-neutral-700 disabled:opacity-40"
        >
          Undo
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().redo().run()
          }
          disabled={!editor.can().redo()}
          className="rounded bg-neutral-800 px-3 py-1 text-gray-300 hover:bg-neutral-700 disabled:opacity-40"
        >
          Redo
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
});

RichTextEditor.displayName = "RichTextEditor";

export default RichTextEditor;