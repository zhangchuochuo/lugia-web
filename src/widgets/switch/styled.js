/*
 * by wangcuixia
 * */
import { css } from 'styled-components';
import colorsFunc from '../css/stateColor';
import CSSProvider from '../theme/CSSProvider';
import { px2emcss } from '../css/units';
const em = px2emcss(1.2);

const { themeColor } = colorsFunc();
export const SwitchWrapper = CSSProvider({
  tag: 'span',
  normal: {
    selectNames: [
      ['width'],
      ['height'],
      ['background'],
      ['fontSize'],
      ['borderRadius'],
      ['border'],
      ['boxShadow'],
      ['color'],
      ['fontSize'],
      ['font'],
    ],
    getCSS(themeMeta) {
      return {
        ...themeMeta,
      };
    },
  },
  disabled: {
    selectNames: [['background'], ['border']],
  },
  css: css`
    box-sizing: border-box;
    display: inline-block;
    position: relative;
    color: rgba(255, 255, 255, 0.8);
    cursor: pointer;
    vertical-align: middle;
    &:focus {
      outline: none;
    }
  `,
});

export const SwitchText = CSSProvider({
  tag: 'span',
  normal: {
    selectNames: [['fontSize'], ['color'], ['padding']],
    getCSS(themeMeta, themeProps) {
      const { fontSize, fontWeight, color } = themeMeta;
      const {
        propsConfig: { textPosition },
      } = themeProps;
      return `
          & > *:first-child {
            ${textPosition};
            font-size:${em(fontSize)};
            font-weight:${fontWeight};
            color:${color};
            height:${em(fontSize)};
            line-height:${em(fontSize)};
            & > *:first-child{
              font-size:${em(fontSize)};
              font-weight:${fontWeight};
              color:${color};
            }
          }         
        `;
    },
  },
  css: css`
    user-select: none;
    & > *:first-child {
      position: absolute;
      top: 50%;
      font-style: normal;
      font-size: ${em(12)};
      color: #fff;
      height: ${em(12)};
      line-height: ${em(12)};
    }
  `,
});

export const SwitchCircle = CSSProvider({
  tag: 'span',
  normal: {
    selectNames: [
      ['width'],
      ['height'],
      ['background'],
      ['borderRadius'],
      ['border'],
      ['boxShadow'],
      ['color'],
    ],
    getCSS(themeMeta, themeProps) {
      const { height, width, color } = themeMeta;
      const {
        propsConfig: { switchButtonPosition },
      } = themeProps;
      return `
          ${switchButtonPosition};
          & > *:first-child {
            height:${em(height)};
            & > *:first-child {
              font-size:${em(width - 4)};
              color:${color}
            }
          }
        `;
    },
  },
  actived: {
    selectNames: [
      ['width'],
      ['height'],
      ['background'],
      ['borderRadius'],
      ['border'],
      ['boxShadow'],
    ],
    getCSS(themeMeta) {
      const { borderRadius } = themeMeta;
      return {
        ...themeMeta,
        'border-radius': borderRadius,
      };
    },
  },
  disabled: {
    selectNames: [['background'], ['border'], ['width'], ['height'], ['borderRadius']],
  },
  css: css`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    -webkit-transform: translateY(-50%);
    transition: 1s;
    -webkit-transition: all 0.2s;
    & > *:first-child {
      display: block;
      color: ${themeColor};
      animation: rotate 1.5s linear infinite;
      position: relative;
      & > *:first-child {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
      &::before {
        transform: scale(0.65);
      }
    }

    @keyframes rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `,
});
