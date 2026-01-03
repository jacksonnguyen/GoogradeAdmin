import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import clsx from 'clsx';
import { Bold, Italic, Underline as UnderlineIcon, AlignLeft, AlignCenter, List, ListOrdered } from 'lucide-react';
// import styles from './TipTapEditor.module.scss'; // REMOVED

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
  editable?: boolean;
  className?: string; // Add className optional prop
}

export function TipTapEditor({ content, onChange, editable = true, className = '' }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className={clsx("bg-white border-2 border-border rounded-2xl flex flex-col overflow-hidden shadow-sm", className)}>
      <div className="flex items-center gap-1 p-2 bg-gray-50 border-b-2 border-border flex-wrap">
        <ToolbarButton 
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
        >
          <Bold size={18} />
        </ToolbarButton>
        <ToolbarButton 
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
        >
          <Italic size={18} />
        </ToolbarButton>
        <ToolbarButton 
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
        >
            <UnderlineIcon size={18} />
        </ToolbarButton>
        
        <div className="w-[2px] h-5 bg-border mx-2" />

        <ToolbarButton 
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            isActive={editor.isActive({ textAlign: 'left' })}
        >
          <AlignLeft size={18} />
        </ToolbarButton>
        <ToolbarButton 
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            isActive={editor.isActive({ textAlign: 'center' })}
        >
          <AlignCenter size={18} />
        </ToolbarButton>
        
        <div className="w-[2px] h-5 bg-border mx-2" />

        <ToolbarButton 
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
        >
          <List size={18} />
        </ToolbarButton>
        <ToolbarButton 
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
        >
          <ListOrdered size={18} />
        </ToolbarButton>
      </div>
      
      <div className="p-6 min-h-[400px] prose prose-lg max-w-none focus:outline-none">
         <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function ToolbarButton({ onClick, isActive, children }: { onClick: () => void, isActive: boolean, children: React.ReactNode }) {
    return (
        <button
          onClick={onClick}
          className={clsx(
              "p-2 rounded-lg transition-colors",
              isActive ? "bg-primary/10 text-primary-dark" : "text-text-light hover:bg-gray-200 hover:text-text"
          )}
        >
            {children}
        </button>
    )
}
