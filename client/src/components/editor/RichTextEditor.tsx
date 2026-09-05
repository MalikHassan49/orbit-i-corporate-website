import { useEffect } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'

export function RichTextEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: false })],
    content: value,
    onUpdate: ({ editor: current }) => onChange(current.getHTML()),
    editorProps: { attributes: { class: 'min-h-48 rounded border p-3 outline-none text-sm text-[var(--color-text-primary)]' } },
  })
  useEffect(() => {
    if (editor && value !== editor.getHTML()) editor.commands.setContent(value)
  }, [editor, value])
  if (!editor) return null
  return <div><div className="mb-2 flex gap-2"><button type="button" className="text-xs" onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button><button type="button" className="text-xs" onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</button><button type="button" className="text-xs" onClick={() => editor.chain().focus().toggleBulletList().run()}>List</button></div><EditorContent editor={editor} /></div>
}
