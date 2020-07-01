import React, { useRef, useEffect } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100vw;
  box-sizing: border-box;
  min-height: 100vh;
  padding: 60px 5% 2.5%;
`;
const Title = styled.h1`
  font-size: 44px;
  line-height: 48px;
  margin: 10px 0px;
  &:empty:before {
    content: attr(data-placeholder);
    color: gray;
  }
  outline: none;
`;

const Author = styled.h3`
  font-size: 20px;
  color: rgba(0, 0, 0, 0.7);
  &:before {
    content: "Written by ";
  }
  outline: none;
`;

const Content = styled.div`
  &:empty:before {
    content: attr(data-placeholder);
    color: gray;
  }
  outline: none;
`;
const Editor = (props) => {
  const content = useRef();
  useEffect(() => {
    document.execCommand("defaultParagraphSeparator", false, "p");
  }, []);
  const format = (com, val) => {
    document.execCommand(com, false, val);
    content.current.focus();
  };
  const setHeader = (id) => {
    format("formatblock", `h${id}`);
  };
  const dataExtractor = (nodes, final) => {
    for (let ele of nodes) {
      console.log(ele.childNodes);
      if (ele.childNodes[0].nodeName === "BR") {
        console.log(final);
        return;
      } else {
        if (ele.childNodes[0].nodeName === "#text") {
          console.log(ele);
          final.push({
            type: ele.localName,
            content: ele.innerHTML.split("<br>")[0],
          });
        } else {
          dataExtractor(ele.childNodes, final);
        }
      }
    }
    console.log(final);
  };
  const submit = () => {
    console.log(content.current, []);
    dataExtractor(content.current.childNodes, []);
  };
  return (
    <Wrapper>
      <Title id="title" contentEditable="true" data-placeholder="Title"></Title>
      <Author contentEditable="true"></Author>
      <button onClick={() => setHeader(2)}>h2</button>
      <button onClick={() => setHeader(3)}>h3</button>
      <button onClick={() => setHeader(4)}>h4</button>
      <button onClick={() => submit()}>Submit</button>
      <Content
        contentEditable
        data-placeholder="Content"
        ref={content}
      ></Content>
    </Wrapper>
  );
};

export default Editor;
