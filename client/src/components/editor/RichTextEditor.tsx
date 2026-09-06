import { useEffect, type ReactNode } from 'react'
import { EditorContent, useEditor, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import {
  Bold,
  Code,
  ExternalLink,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  SquareMousePointer,
  Table2,
  Underline as UnderlineIcon,
} from 'lucide-react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

function ToolbarButton({
  label,
  onClick,
  active = false,
  children,
}: {
  label: string
  onClick: () => void
  active?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={`inline-flex size-8 items-center justify-center rounded border text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-background-elevated)] hover:text-[var(--color-text-primary)] ${active ? 'border-primary-400 bg-primary-500/15 text-primary-300' : 'border-transparent'}`}
    >
      {children}
    </button>
  )
}

function addLink(editor: Editor, kind: 'internal' | 'external') {
  const href = window.prompt(kind === 'internal' ? 'Enter an internal path (for example /services):' : 'Enter the external URL:')
  if (!href?.trim()) return
  editor.chain().focus().setLink({ href: href.trim(), target: kind === 'external' ? '_blank' : null }).run()
}

function addImage(editor: Editor) {
  const src = window.prompt('Enter the image URL:')
  if (!src?.trim()) return
  const alt = window.prompt('Enter image alt text (optional):') || ''
  editor.chain().focus().setImage({ src: src.trim(), alt }).run()
}

function addButton(editor: Editor) {
  const label = window.prompt('Enter button text:')
  const href = window.prompt('Enter button URL:')
  if (!label?.trim() || !href?.trim()) return
  editor.chain().focus().insertContent(
    `<a href="${href.trim()}" class="editor-button">${label.trim()}</a><p></p>`,
  ).run()
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({ allowBase64: false }),
      Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    onUpdate: ({ editor: current }) => onChange(current.getHTML()),
    editorProps: {
      attributes: {
        class: 'h-96 w-full min-w-0 max-w-full overflow-x-hidden overflow-y-auto break-words rounded-b border border-t-0 p-3 outline-none text-sm text-[var(--color-text-primary)] prose prose-invert max-w-none [overflow-wrap:anywhere] [&_img]:max-w-full [&_img]:h-auto [&_table]:w-full [&_table]:max-w-full [&_table]:table-fixed [&_td]:break-words [&_th]:break-words',
      },
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) editor.commands.setContent(value)
  }, [editor, value])

  if (!editor) return null

  const headingButtons = [
    [1, Heading1],
    [2, Heading2],
    [3, Heading3],
    [4, Heading4],
    [5, Heading5],
    [6, Heading6],
  ] as const

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden rounded">
      <div className="flex max-w-full flex-wrap items-center gap-1 border border-[var(--color-border)] bg-[var(--color-background-elevated)] p-1">
        {headingButtons.map(([level, Icon]) => (
          <ToolbarButton
            key={level}
            label={`Heading ${level}`}
            active={editor.isActive('heading', { level })}
            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
          >
            <Icon className="size-4" aria-hidden />
          </ToolbarButton>
        ))}
        <span className="mx-1 h-5 w-px bg-[var(--color-border)]" />
        <ToolbarButton label="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="size-4" /></ToolbarButton>
        <ToolbarButton label="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="size-4" /></ToolbarButton>
        <ToolbarButton label="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon className="size-4" /></ToolbarButton>
        <ToolbarButton label="Bulleted list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="size-4" /></ToolbarButton>
        <ToolbarButton label="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="size-4" /></ToolbarButton>
        <ToolbarButton label="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="size-4" /></ToolbarButton>
        <ToolbarButton label="Code block" active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code className="size-4" /></ToolbarButton>
        <ToolbarButton label="Insert table" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><Table2 className="size-4" /></ToolbarButton>
        <ToolbarButton label="Insert image" onClick={() => addImage(editor)}><ImageIcon className="size-4" /></ToolbarButton>
        <ToolbarButton label="Internal link" onClick={() => addLink(editor, 'internal')}><LinkIcon className="size-4" /></ToolbarButton>
        <ToolbarButton label="External link" onClick={() => addLink(editor, 'external')}><ExternalLink className="size-4" /></ToolbarButton>
        <ToolbarButton label="Insert button" onClick={() => addButton(editor)}><SquareMousePointer className="size-4" /></ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
