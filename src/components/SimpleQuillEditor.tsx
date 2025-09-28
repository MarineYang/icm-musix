import { useEffect, useRef, useState } from 'react';

interface SimpleQuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SimpleQuillEditor({ value, onChange, placeholder = '내용을 입력하세요...' }: SimpleQuillEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  return (
    <div className="rounded-lg overflow-hidden border border-gray-700">
      {/* 툴바 */}
      <div className="bg-gray-800 border-b border-gray-700 flex items-center space-x-1 p-3">
        <button
          type="button"
          onClick={() => handleFormat('bold')}
          className="px-3 py-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors font-bold"
          title="굵게"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => handleFormat('italic')}
          className="px-3 py-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors italic"
          title="기울임"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => handleFormat('underline')}
          className="px-3 py-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors underline"
          title="밑줄"
        >
          U
        </button>
        <div className="w-px h-6 bg-gray-600"></div>
        <button
          type="button"
          onClick={() => handleFormat('insertUnorderedList')}
          className="px-3 py-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
          title="불릿 목록"
        >
          •
        </button>
        <button
          type="button"
          onClick={() => handleFormat('insertOrderedList')}
          className="px-3 py-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
          title="번호 목록"
        >
          1.
        </button>
        <div className="w-px h-6 bg-gray-600"></div>
        <button
          type="button"
          onClick={() => {
            const url = prompt('링크 URL을 입력하세요:');
            if (url) handleFormat('createLink', url);
          }}
          className="px-3 py-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
          title="링크"
        >
          🔗
        </button>
      </div>

      {/* 에디터 */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          min-h-96 p-4 bg-gray-900/50 text-white focus:outline-none
          ${!value && !isFocused ? 'text-gray-500' : ''}
        `}
        style={{
          minHeight: '400px',
          lineHeight: '1.6'
        }}
        suppressContentEditableWarning={true}
        data-placeholder={placeholder}
      />
      
      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #6b7280;
          font-style: italic;
        }
        [contenteditable]:focus:before {
          content: '';
        }
      `}</style>
    </div>
  );
}
