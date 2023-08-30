import { useState, memo } from "react";
import { EditorState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import PropTypes from "prop-types";

// styles
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./styles.css";

function Content({ id, label, className, value, onChange, editorFixed }) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (nEditorState) => setEditorState(nEditorState);

  return (
    <div className={className}>
      <label htmlFor={id}>{label}</label>
      <Editor
        editorState={value || editorState}
        wrapperClassName="wrapper"
        editorClassName={`editor ${editorFixed ? "editor-fixed" : ""}`}
        onEditorStateChange={onChange || onEditorStateChange}
      />
    </div>
  );
}

Content.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  editorFixed: PropTypes.bool,
};

const ContentMemo = memo((props) => <Content {...props} />, arePropsEqual);
ContentMemo.displayName = "Content";

function arePropsEqual(oldProps, newProps) {
  return (
    oldProps.className === newProps.className &&
    oldProps.value === newProps.value &&
    oldProps.onChange === newProps.onChange &&
    oldProps.editorFixed === newProps.editorFixed
  );
}

export default ContentMemo;
