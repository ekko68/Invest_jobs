import 'assets/style/toastui-editor.css'
import { Editor } from '@toast-ui/react-editor'
import { useEffect, useRef, useState } from 'react'

// Toast ColorSyntax 플러그인
import 'tui-color-picker/dist/tui-color-picker.css'
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css'
import colorSyntax from '@toast-ui/editor-plugin-color-syntax'

const TextEditor = ({ data, handleChange }) => {
  const editorRef = useRef()
  const [init, setInit] = useState(false)

  const onChange = () => {
    const value =
      editorRef.current.getInstance()?.mode === 'markdown'
        ? editorRef.current?.getInstance()?.getMarkdown()
        : editorRef.current?.getInstance()?.getHTML()
    handleChange(value)
  }

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    return doc.body.textContent || ''
  }

  useEffect(() => {
    if (!init) {
      const editorInstance = editorRef.current.getInstance()
      if (editorInstance && data) {
        editorInstance.setHTML(data)
        setInit(true)
      }
    }
  }, [data])

  return (
    <div className="editor_wrapper">
      <Editor
        height="600px"
        // placeholder="Please Enter Text."
        autofocus={true}
        ref={editorRef}
        onChange={onChange}
        previewStyle="vertical" // or tab
        initialEditType="wysiwyg" // or markdown
        hideModeSwitch={true} // 하단 숨기기
        toolbarItems={[
          // 툴바 옵션 설정
          ['heading', 'bold', 'italic', 'strike'],
          ['hr', 'quote'],
          ['ul', 'ol', 'task', 'indent', 'outdent'],
          ['table', 'image', 'link'],
          ['code', 'codeblock']
        ]}
        plugins={[colorSyntax]} // colorSyntax 플러그인 적용
        //theme="dark"
        //useCommandShortcut={false} // 키보드 입력 컨트롤 방지 ex ctrl z 등
        // usageStatistics={false} // 통계 수집 거부
      />
    </div>
  )
}

export default TextEditor
