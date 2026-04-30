import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { Button } from "@/components/ui/button";
import {
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered,
  Quote, Link as LinkIcon, Undo, Redo, Heading2, Code,
} from "lucide-react";
import { useEffect } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
  autoFocus?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your message...",
  minHeight = 180,
  autoFocus = false,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener", target: "_blank" } }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    autofocus: autoFocus,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none focus:outline-none px-3 py-2 text-sm",
        style: `min-height: ${minHeight}px`,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html === "<p></p>" ? "" : html);
    },
  });

  // Keep external `value` in sync if it changes (e.g. loading a draft).
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const next = value || "<p></p>";
    if (current !== next) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  if (!editor) return null;

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const btn = (active: boolean, onClick: () => void, title: string, children: React.ReactNode) => (
    <Button
      type="button"
      size="sm"
      variant={active ? "secondary" : "ghost"}
      className="h-7 w-7 p-0"
      title={title}
      onClick={onClick}
      data-testid={`editor-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {children}
    </Button>
  );

  return (
    <div className="border border-border/60 rounded-md bg-background overflow-hidden">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border/40 bg-muted/30 px-1.5 py-1">
        {btn(editor.isActive("bold"), () => editor.chain().focus().toggleBold().run(), "Bold", <Bold className="w-3.5 h-3.5" />)}
        {btn(editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run(), "Italic", <Italic className="w-3.5 h-3.5" />)}
        {btn(editor.isActive("underline"), () => editor.chain().focus().toggleUnderline().run(), "Underline", <UnderlineIcon className="w-3.5 h-3.5" />)}
        <div className="w-px h-4 bg-border/60 mx-0.5" />
        {btn(editor.isActive("heading", { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), "Heading", <Heading2 className="w-3.5 h-3.5" />)}
        {btn(editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run(), "Bullets", <List className="w-3.5 h-3.5" />)}
        {btn(editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run(), "Numbered", <ListOrdered className="w-3.5 h-3.5" />)}
        {btn(editor.isActive("blockquote"), () => editor.chain().focus().toggleBlockquote().run(), "Quote", <Quote className="w-3.5 h-3.5" />)}
        {btn(editor.isActive("code"), () => editor.chain().focus().toggleCode().run(), "Code", <Code className="w-3.5 h-3.5" />)}
        {btn(editor.isActive("link"), setLink, "Link", <LinkIcon className="w-3.5 h-3.5" />)}
        <div className="w-px h-4 bg-border/60 mx-0.5" />
        {btn(false, () => editor.chain().focus().undo().run(), "Undo", <Undo className="w-3.5 h-3.5" />)}
        {btn(false, () => editor.chain().focus().redo().run(), "Redo", <Redo className="w-3.5 h-3.5" />)}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
