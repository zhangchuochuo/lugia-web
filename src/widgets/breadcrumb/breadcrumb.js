/**
 *  create by szfeng
 *
 * @flow
 */
import * as React from 'react';
import { cloneElement } from 'react';
import BreadcrumbItem from './breadcrumbItem';
import { getHrefs, replaceStr } from '../common/StringUtils';
import { BreadcrumbContainer } from '../css/breadcrumb';
import { deepMerge } from '@lugia/object-utils';
import Widget from '../consts/index';

export type Route = {
  path: string,
  title: string,
};

export type RenderFunc = (
  route: Object[],
  separator: string | React.Element<any>,
  lastSeparator: string | React.Element<any>
) => React.Element<any>;

export type BreadcrumbProps = {
  routes?: Array<Route>,
  params?: Object,
  separator: string | React.Element<any>,
  renderItem?: RenderFunc,
  lastSeparator: string | React.Element<any>,
  themeProps: Object,
  mergeThemeStateAndChildThemeProps: Function,
  getChildThemeHocProps: Function,
  children: React.ChildrenArray<React.Element<any>>,
};

export type breadCrumbItemConfig = Array<Object>;

function isNotHref(target: Object) {
  return 'href' in target || 'path' in target;
}

function defaultRenderItem(
  breadCrumbItemConfig: breadCrumbItemConfig,
  separator: string | React.Element<any>,
  lastSeparator: string | React.Element<any>,
  config: Object
): Object {
  return breadCrumbItemConfig.map(item => {
    const { href, title, isLast } = item;

    return (
      <BreadcrumbItem
        separator={isLast ? lastSeparator : separator}
        href={href}
        isLastItem={isLast}
        {...config}
      >
        {title}
      </BreadcrumbItem>
    );
  });
}

export default class Breadcrumb extends React.Component<BreadcrumbProps, any> {
  static defaultProps = {
    separator: '/',
    lastSeparator: '',
  };
  static Item = BreadcrumbItem;
  static displayName = Widget.Breadcrumb;

  getRealityHrefs(href: string, param: Object, item: Object): string | void {
    if (!isNotHref(item)) {
      return undefined;
    }

    let newHref = href[0] === '/' ? href : '/' + href;
    newHref = replaceStr(newHref, param);
    return newHref;
  }

  getBreadCrumbItemConfig(routerConfig: Object[], param?: Object = {}): Object[] {
    const paths = routerConfig.map(({ path }) => path);
    const hrefs = getHrefs(paths);

    return routerConfig.map(
      (item: Object, i: number, data: Object[]): Object => {
        const { title, href = hrefs[i] } = item;

        return {
          href: this.getRealityHrefs(href, param, item),
          title: replaceStr(title, param),
          isLast: i === data.length - 1,
        };
      }
    );
  }

  getChildConfig(children: React.ChildrenArray<React.Element<any>>) {
    const result = [];
    children &&
      React.Children.forEach(children, item => {
        const props = item ? item.props : {};
        result.push(props ? props : {});
      });
    return result;
  }

  getChildrenThemeProps = () => {
    const { themeProps, mergeThemeStateAndChildThemeProps, getChildThemeHocProps } = this.props;

    const separatorThemeProps = deepMerge(
      themeProps,
      mergeThemeStateAndChildThemeProps('Separator')
    );

    const { normal = {} } = themeProps.themeConfig;
    const textThemeHoc = getChildThemeHocProps('Text');

    const { theme: textTheme, viewClass } = getChildThemeHocProps('Text');

    textThemeHoc.theme[viewClass] = deepMerge({ normal }, textTheme[viewClass]);

    return {
      textThemeHoc,
      separatorThemeProps,
    };
  };

  render() {
    let crumbs;
    const {
      separator,
      lastSeparator,
      routes,
      params = {},
      renderItem = defaultRenderItem,
      children,
      themeProps,
    } = this.props;

    const { textThemeHoc, separatorThemeProps } = this.getChildrenThemeProps();

    const config = { textThemeHoc, separatorThemeProps, themeProps };
    if (!routes && !children) {
      crumbs = [
        <BreadcrumbItem {...config} separator={separator}>
          首页
        </BreadcrumbItem>,
        <BreadcrumbItem {...config} separator={separator}>
          一级面包屑
        </BreadcrumbItem>,
        <BreadcrumbItem {...config} separator={separator}>
          二级面包屑
        </BreadcrumbItem>,
        <BreadcrumbItem {...config} separator={''} isLastItem>
          三级面包屑
        </BreadcrumbItem>,
      ];
    }

    if (routes && routes.length > 0) {
      const breadCrumbItemConfig = this.getBreadCrumbItemConfig(routes, params);
      return (
        <BreadcrumbContainer themeProps={themeProps}>
          {renderItem(breadCrumbItemConfig, separator, lastSeparator, config)}
        </BreadcrumbContainer>
      );
    }

    if (Array.isArray(children)) {
      const childConfig = this.getChildConfig(children);
      const childrenPro = this.getBreadCrumbItemConfig(childConfig, params);

      crumbs = React.Children.map(children, (element: any, index) => {
        if (!element) {
          return null;
        }
        const { isLast, href } = childrenPro[index];

        return cloneElement(element, {
          separator: isLast ? lastSeparator : separator,
          isLastItem: isLast,
          href,
          key: index,
          themeProps,
          textThemeHoc,
          separatorThemeProps,
        });
      });
    } else {
      children &&
        (crumbs = cloneElement(children, {
          separator: lastSeparator,
          isLastItem: true,
          key: 'one',
          themeProps,
          textThemeHoc,
          separatorThemeProps,
        }));
    }
    return <BreadcrumbContainer themeProps={themeProps}>{crumbs}</BreadcrumbContainer>;
  }
}
