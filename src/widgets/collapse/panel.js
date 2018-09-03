/**
 *
 * create by guorg
 *
 * @flow
 *
 */
import * as React from 'react';
import ThemeProvider from '../theme-provider';
import Widget from '../consts/index';
import type { PanelProps, PanelState } from '../css/panel';
import {
  Wrap,
  HoverIconWrap,
  IconWrap,
  PanelContent,
  PanelContentWrap,
  PanelHeader,
  PanelWrap,
} from '../css/panel';

PanelHeader.displayName = 'Panel';

export default ThemeProvider(
  class extends React.Component<PanelProps, PanelState> {
    panel: any;
    header: any;
    height: number;

    constructor(props) {
      super(props);
      this.state = {
        open: false,
        opening: false,
        closing: false,
        height: 0,
        hover: false,
        headerHeight: 0,
      };
      this.height = 0;
    }

    static getDerivedStateFromProps(props, state) {
      const { open, defaultOpen } = props;
      const hasOpen = 'open' in props;
      const theOpen = hasOpen ? open : state ? state.open : defaultOpen;
      const result: Object = {
        open: theOpen,
      };
      if (hasOpen) {
        result.closing = false;
        result.opening = false;
        if (state.open === true && theOpen === false) {
          result.closing = true;
        }
        if (state.open === false && theOpen === true) {
          result.opening = true;
        }
      }
      return result;
    }

    componentDidMount() {
      this.height = this.panel.scrollHeight;

      const headerHeight = this.header.scrollHeight;
      this.setState({
        headerHeight,
      });
    }

    render() {
      const { opening, closing, open, hover, headerHeight } = this.state;
      const { disabled = false, header, children, getTheme, showArrow = true } = this.props;
      const config = {};
      if (!showArrow) {
        config.onMouseMove = this.iconMouseEnter;
        config.onMouseLeave = this.iconMouseLeave;
      }
      return (
        <Wrap hover={hover} themes={getTheme()} {...config}>
          <PanelWrap hover={hover} themes={getTheme()} {...config}>
            <PanelHeader
              disabled={disabled}
              showArrow={showArrow}
              themes={getTheme()}
              onClick={this.handlePanelClick}
              innerRef={(node: any) => (this.header = node)}
            >
              {showArrow ? (
                <IconWrap
                  open={open}
                  iconClass="lugia-icon-direction_caret_right"
                  opening={opening}
                  closing={closing}
                />
              ) : null}
              {header}
              <HoverIconWrap themes={getTheme()} headerHeight={headerHeight} hover={hover}>
                <IconWrap
                  open={open}
                  iconClass="lugia-icon-direction_caret_right"
                  opening={opening}
                  closing={closing}
                />
              </HoverIconWrap>
            </PanelHeader>
            <PanelContentWrap
              innerRef={(node: any) => (this.panel = node)}
              open={open}
              opening={opening}
              closing={closing}
              height={this.height}
              disabled={disabled}
              themes={getTheme()}
              hover={hover}
            >
              <PanelContent showArrow={showArrow} hover={hover}>
                {children}
              </PanelContent>
            </PanelContentWrap>
          </PanelWrap>
        </Wrap>
      );
    }

    iconMouseEnter = () => {
      this.setState({
        hover: true,
      });
    };

    iconMouseLeave = () => {
      this.setState({
        hover: false,
      });
    };

    handlePanelClick = (e: Event) => {
      const { disabled = false, value, onClick } = this.props;
      if (!disabled) {
        const height = this.panel.scrollHeight;
        const { opening, closing, open } = this.state;
        if (!this.hasOpen() && (opening || closing)) {
          return;
        }
        this.height = height;
        const reset: Object = {
          closing: false,
          opening: false,
        };

        if (!this.hasOpen()) {
          this.setState(this.getClickState(open));
          setTimeout(() => {
            reset.open = !open;
            this.setState(reset);
            onClick && onClick(value);
          }, 300);
        } else {
          onClick && onClick(value);
        }
      }
      e.preventDefault();
    };
    hasOpen = () => 'open' in this.props;

    componentDidUpdate() {
      const { opening, closing } = this.state;
      this.height = this.panel.scrollHeight;
      if (this.hasOpen() && (opening === true || closing === true)) {
        setTimeout(() => {
          this.height = 0;
          this.setState({
            opening: false,
            closing: false,
          });
        }, 300);
      }
    }

    getClickState = (open: boolean): Object => {
      if (open) {
        return { closing: true };
      }
      return { opening: true };
    };
  },
  Widget.Panel
);
