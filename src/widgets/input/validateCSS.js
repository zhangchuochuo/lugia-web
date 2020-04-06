import React from 'react';
import CSSComponent, { css } from '@lugia/theme-css-hoc';
import { isValidateError } from '../css/validateHoc';
import { units } from '@lugia/css';
import get from '../css/theme-common-dict';
import { getWidthCSS } from './utils';
const { px2remcss } = units;
const dangerColor = '$lugia-dict.@lugia/lugia-web.dangerColor';

function getTipShowCSS(themeProps: Object) {
  const { propsConfig } = themeProps;
  const { validateStatus, _isValidateVisible = true } = propsConfig;
  const theVisibility =
    isValidateError(validateStatus) && _isValidateVisible ? 'visible' : 'hidden';
  return `visibility:${theVisibility}`;
}

export const TipBottom = CSSComponent({
  tag: 'div',
  className: 'inputTipBottom',
  normal: {
    selectNames: [['color'], ['font'], ['fontSize']],
    defaultTheme: {
      color: dangerColor,
      fontSize: 12,
      height: 32,
      margin: {
        left: 10,
        top: 4,
      },
    },
    getCSS(themeMeta: Object, themeProps: Object) {
      return getTipShowCSS(themeProps);
    },
  },
  hover: {
    selectNames: [],
  },
  active: {
    selectNames: [],
  },
});

export const InnerTipText: Object = CSSComponent({
  tag: 'span',
  className: 'InnerTip',
  normal: {
    selectNames: [['font'], ['fontSize'], ['color']],
    defaultTheme: {
      color: dangerColor,
      fontSize: 12,
    },
    getCSS(themeMeta: Object, themeProps: Object) {
      return getTipShowCSS(themeProps);
    },
  },
  css: css`
    min-width: ${px2remcss(30)};
    background-color: ${get('defaultColor')};
    position: absolute;
    right: ${px2remcss(32)};
    top: 50%;
    transform: translateY(-50%);
    box-shadow: ${px2remcss(-14)} 0 ${px2remcss(6)} 0 ${get('defaultColor')};
  `,
});

export const BottomContainer: Object = CSSComponent({
  tag: 'div',
  className: 'BottomContainer',
  normal: {
    selectNames: [['width']],
    getCSS(themeMeta, themeProps) {
      const { width } = themeMeta;
      return getWidthCSS(width);
    },
  },
  hover: {
    selectNames: [],
  },
  active: {
    selectNames: [],
  },
  disabled: {
    selectNames: [],
  },
  css: css`
    font-size: 0;
  `,
});

export const FatherContainer: Object = CSSComponent({
  extend: BottomContainer,
  className: 'FatherContainer',
  css: css`
    position: relative;
  `,
});