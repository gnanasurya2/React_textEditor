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

const Button = styled.button`
  background-color:blue;
  border:none;
  margin-left:20px;
  margin-top:30px;
  margin-bottom:30px;
  padding:8px 24px;
  border-radius:12px;
  color:white;
  cursor:pointer;
  transition:all 0.2s linear;
  &:hover {
    -webkit-box-shadow: 0 10px 6px -6px #777;
    -moz-box-shadow: 0 10px 6px -6px #777;
         box-shadow: 0 10px 6px -6px #777;
  }

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
  const downloadRef = useRef();
  const titleRef = useRef();
  const authorRef = useRef();
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
    let data = {
      title : titleRef.current.innerHTML,
      author: authorRef.current.innerHTML,
      url:"",
      content:final
    }
    console.log({data});
    var blob = new Blob([JSON.stringify(data)],{type:"text/json"});
    console.log(blob);
    var fileName = titleRef.current.innerHTML.split(" ").join("_")+".json";
    if(window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob,fileName);
    } else {
      var elem = downloadRef.current;
      elem.href = window.URL.createObjectURL(blob);
      elem.download = fileName;        
      elem.click();        
    }
  };
  const submit = () => {
    
    dataExtractor(content.current.childNodes, []);
  };
  return (
    <Wrapper>
      <Title id="title" ref={titleRef} contentEditable="true" data-placeholder="Title" ></Title>
      <Author contentEditable="true" ref={authorRef}></Author>
      <Button onClick={() => setHeader(2)}>h2</Button>
      <Button onClick={() => setHeader(3)}>h3</Button>
      <Button onClick={() => setHeader(4)}>h4</Button>
      <Button onClick={() => submit()}>Submit</Button>
      <Content
        contentEditable
        data-placeholder="Content"
        ref={content}
      ></Content>
      <a ref={downloadRef} style={{display:"none"}}></a>
    </Wrapper>
  );
};

export default Editor;
