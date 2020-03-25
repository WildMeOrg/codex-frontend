export const globalCss = `
  html {
    box-sizing: border-box;
  }
  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  html,
  body,
  #root {
    height: 100%;
    width: 100%;
    position: relative;
    overflow: hidden;
  }
  * {
    ::-webkit-scrollbar {
      height: 12px;
      width: 12px;
      background-color: rgba(255, 255, 255, 0);
    }

    ::-webkit-scrollbar-track,
    ::-webkit-scrollbar-thumb {
      border: 3px solid rgba(255, 255, 255, 0);
      border-radius: 10px;
      background-clip: padding-box;
    }

    ::-webkit-scrollbar-track {
      background-color: rgba(255, 255, 255, 0);
    }

    ::-webkit-scrollbar-thumb {
      background-color: green;
      &:hover {
        background-color: blue;
      }
      &:active {
        background-color: red;
      }
    }
  }
  ul {
    padding: 0;
    margin-right: 0;
  }
`;
