'use client';

import {
  Alert,
  type AlertCssVariables,
  Avatar,
  type AvatarCssVariables,
  Button,
  type ButtonCssVariables,
  type CSSVariablesResolver,
  createTheme,
  Radio,
  type RadioCssVariables,
  RangeSlider,
  rem,
  Slider,
  type SliderCssVariables,
  Table,
  TextInput,
} from '@mantine/core';
import clsx from 'clsx';
import type { CSSProperties } from 'react';

type ButtonRootVars = Partial<Record<ButtonCssVariables['root'], string>>;
type AlertRootVars = Partial<Record<AlertCssVariables['root'], string>>;
type SliderRootVars = Partial<Record<SliderCssVariables['root'], string>>;

const buttonTheme = Button.extend({
  defaultProps: {
    style: { fontWeight: '400' },
  },
  vars: (theme, props) => ({
    root: {
      ...buttonSizeVars(props.size ?? 'md'),
      ...buttonRadiusVars(props.variant ?? 'filled'),
      ...buttonColorVars(props.color ?? 'primary', props.variant ?? 'filled'),
    },
  }),
  styles: (theme, props) => ({
    root: props.disabled
      ? disabledButtonStyles(
          props.color ?? 'primary',
          props.variant ?? 'filled'
        )
      : {},
  }),
  classNames: (theme, props) => {
    if (props.variant === 'comic') {
      return {
        root: clsx('transition-all duration-200 active:!translate-y-[10px]'),
        label: clsx(
          '-ml-1',
          'lh-normal cbm:text-xl',
          'tracking-[1.92px] cbm:tracking-[2.4px] cbl:text-3xl cbl:tracking-[1.92px]'
        ),
        section: 'dls-button-section',
      };
    }

    if (props.color === 'dark') {
      return {
        section: 'dls-button-section-dark',
      };
    }

    return {
      root: clsx(
        'dls-button-on-active',
        'dls-button-on-hover',
        'no-transition',
        '!font-normal'
      ),
      section: 'dls-button-section',
    };
  },
});

const alertTheme = Alert.extend({
  vars: (theme, props) => ({
    root: alertColorVars(props.color ?? 'blue', props.variant ?? 'light'),
  }),
  styles: (theme, props) => ({
    closeButton: {
      color:
        props.variant === 'filled' &&
        (props.color === 'danger' || props.color === 'blue' || !props.color)
          ? 'var(--Color-White)'
          : 'var(--Black)',
    },
  }),
  classNames: () => ({
    title: 'body-14 !font-semibold sentenceCase',
    message: 'body-14-light',
  }),
});

const sliderClassNames = {
  root: '[--track-bg:var(--Elements-Neb-20-Alpha)]',
  thumb: [
    '!border-2 !border-Elements-Neb-Ultra-Super !rounded-[6px] !bg-white',
    '!shadow-[0_1px_6px_rgba(0,0,0,0.1)]',
    'transition-[box-shadow,border-color] duration-150 ease-in-out',
    'focus-visible:!outline focus-visible:!outline-Elements-Neb-60-Alpha',
    'data-[disabled]:!flex data-[disabled]:!bg-Elements-Twilight-0-90',
    'data-[disabled]:!border-Elements-Twilight-40-60 data-[disabled]:!cursor-not-allowed',
  ].join(' '),
  trackContainer: 'data-[disabled]:[--track-bg:var(--Elements-Twilight-20-70)]',
  track: 'data-[disabled]:!opacity-100',
  bar: [
    '!bg-Elements-Neb-Ultra-Super',
    'data-[disabled]:!bg-Elements-Twilight-40-60 data-[disabled]:!opacity-100',
  ].join(' '),
  label: '!-top-10',
  mark: '!w-[1.5px] !h-1.5 !border-none !rounded-none !bg-Elements-Twilight-30-70',
  markWrapper: '!top-[calc(100%+0.75rem)]',
  markLabel: '!hidden',
};

const sliderTheme = {
  vars: () => ({ root: sliderVars() }),
  classNames: sliderClassNames,
};

const handbookTheme = (fontFamily: string, fontFamilyMonospace: string) =>
  createTheme({
    autoContrast: true,
    fontFamily,
    fontFamilyMonospace,
    colors: {
      dark: [
        '#fff',
        '#B8B8B8',
        '#828282',
        '#696969',
        '#353d42',
        '#020c13',
        '#020c13',
        '#020c13',
        '#020c13',
        '#020c13',
      ],
      blue: [
        '#E6EBFF',
        '#CDD7FF',
        '#B5C0F6',
        '#B5C0F6',
        '#B5C0F6',
        '#B5C0F6',
        '#7584DE',
        '#6370BE',
        '#515D9E',
        '#414A80',
      ],
      red: [
        '#ff9c9c',
        '#fd6666',
        '#fc3937',
        '#fd1f1b',
        '#fd0f0c',
        '#e20101',
        '#ca0000',
        '#ca0000',
        '#b10000',
        '#b10000',
      ],
    },
    primaryColor: 'blue',
    primaryShade: 5,
    defaultRadius: rem(2),
    cursorType: 'pointer',
    headings: {
      fontWeight: '400',
    },
    breakpoints: {
      xs: '36em',
      sm: '640px',
      md: '768px',
      'docs-desktop': '997px',
      lg: '1024px',
      xl: '1280px',
      xxl: '1400px',
      cbl: '900px',
      cbm: '590px',
    },
    lineHeights: {
      sm: '1.33',
      md: '1.4',
      lg: '1.5',
      xl: '1.66',
    },
    spacing: {
      xxs: rem(8),
      xs: rem(10),
      sm: rem(12),
      md: rem(16),
      lg: rem(20),
      xl: rem(32),
      xxl: rem(40),
      '3x': rem(64),
      '4x': rem(80),
      '5x': rem(120),
      '1': rem(4),
      '2': rem(8),
      '3': rem(12),
      '4': rem(16),
      '5': rem(20),
      '6': rem(24),
      '7': rem(28),
      '8': rem(32),
      '9': rem(36),
      '10': rem(40),
      '11': rem(44),
      '12': rem(48),
      '14': rem(56),
      '16': rem(64),
      '20': rem(80),
      '24': rem(96),
      '28': rem(112),
      '32': rem(128),
      '36': rem(144),
      '40': rem(160),
      '44': rem(176),
      '48': rem(192),
      '52': rem(208),
      '56': rem(224),
      '60': rem(240),
      '64': rem(256),
      '72': rem(288),
      '80': rem(320),
      '96': rem(384),
    },
    components: {
      Alert: alertTheme,
      Avatar: Avatar.extend({
        vars: () => {
          const rootProps: Partial<Record<AvatarCssVariables['root'], string>> =
            {};

          rootProps['--avatar-bd'] = 'transparent';
          return { root: rootProps };
        },
      }),
      Button: buttonTheme,
      Slider: Slider.extend(sliderTheme),
      RangeSlider: RangeSlider.extend(sliderTheme),
      TextInput: TextInput.extend({
        classNames: {
          label: 'textInputLabel',
        },
      }),
      Radio: Radio.extend({
        vars: () => {
          const rootProps: Partial<Record<RadioCssVariables['root'], string>> =
            {};

          rootProps['--radio-icon-color'] = 'var(--White)';
          rootProps['--radio-color'] = 'var(--Elements-Neb-Ultra-Super)';
          return { root: rootProps };
        },
        classNames: () => ({
          radio: 'border-Elements-Twilight-60-50',
        }),
      }),
      Table: Table.extend({
        classNames: (theme, props) => {
          const classes: Record<string, string> = {};

          switch (props.verticalSpacing) {
            case 'lg':
              classes.td = `!py-4 ${buttonSizeClassString('md')}`;
              break;
            case 'md':
              classes.td = `!py-3 ${buttonSizeClassString('sm')}`;
              break;
            case 'sm':
              classes.td = `!py-2 ${buttonSizeClassString('xs')}`;
              break;
            default:
              classes.td = `!py-1 ${buttonSizeClassString('xs')}`;
              break;
          }

          return classes;
        },
      }),
    },
  });

export const cssVariablesResolver: CSSVariablesResolver = () => ({
  variables: {},
  light: {
    '--mantine-color-body': 'var(--Elements-Twilight-0-90)',
    '--mantine-color-error': '#df0101',
  },
  dark: {
    '--mantine-color-body': 'var(--Elements-Twilight-0-90)',
    '--mantine-color-error': '#FF2E2E',
  },
});

function buttonSizeVars(size?: string): ButtonRootVars {
  switch (size) {
    case 'lg':
      return {
        '--button-height': rem(48),
        '--button-padding-x': rem(26),
        '--button-fz': rem(18),
      };
    case 'compact-lg':
      return {
        '--button-height': rem(34),
        '--button-padding-x': rem(12),
        '--button-fz': rem(18),
      };
    case 'md':
      return {
        '--button-height': rem(40),
        '--button-padding-x': rem(22),
        '--button-fz': rem(16),
      };
    case 'compact-md':
      return {
        '--button-height': rem(30),
        '--button-padding-x': rem(12),
        '--button-fz': rem(16),
      };
    case 'sm':
      return {
        '--button-height': rem(36),
        '--button-padding-x': rem(18),
        '--button-fz': rem(14),
      };
    case 'compact-sm':
      return {
        '--button-height': rem(26),
        '--button-padding-x': rem(8),
        '--button-fz': rem(14),
      };
    case 'xs':
      return {
        '--button-height': rem(28),
        '--button-padding-x': rem(14),
        '--button-fz': rem(12),
      };
    case 'compact-xs':
      return {
        '--button-height': rem(22),
        '--button-padding-x': rem(7),
        '--button-fz': rem(12),
      };
    default:
      throw new Error(`${size} not found`);
  }
}

function buttonColorVars(color: string, variant: string): ButtonRootVars {
  if (variant === 'comic') {
    return {
      '--button-bg': color,
      '--button-color': 'var(--Elements-Twilight-100)',
      '--button-hover': `hwb(from ${color} h calc(w - 20) calc(b + 5))`,
    };
  }

  if (variant === 'subtle') {
    return {
      '--button-bg': 'transparent',
      '--button-color': 'var(--Elements-Twilight-60-50)',
      '--button-hover': 'var(--Elements-Twilight-5-80)',
    };
  }

  switch (color) {
    case 'primary':
      return {
        '--button-bg': 'var(--Elements-Neb-90-Ultra)',
        '--button-color': 'var(--Elements-Twilight-100)',
        '--button-hover': 'var(--Elements-Neb-Ultra-Super)',
      };
    case 'danger':
      if (variant === 'outline') {
        return {
          '--button-bg': 'transparent',
          '--button-color': 'var(--Elements-Red-110-60)',
          '--button-hover-color': 'var(--Elements-Red-60)',
          '--button-hover': 'transparent',
          '--button-bd': '1px solid var(--Elements-Red-110-60)',
          '--button-bd-hover': 'var(--Elements-Red-60)',
        };
      }
      return {
        '--button-bg': 'var(--Elements-Red-110)',
        '--button-color': 'var(--Color-White)',
        '--button-hover': 'var(--Elements-Red-60)',
      };
    case 'black':
      if (variant === 'outline') {
        return {
          '--button-bg': 'transparent',
          '--button-color': 'var(--Black)',
          '--button-hover-color': 'var(--Elements-Twilight-60-50)',
          '--button-hover': 'transparent',
          '--button-bd': '1px solid var(--Black)',
          '--button-bd-hover': 'var(--Elements-Twilight-70-50)',
        };
      }
      return {
        '--button-bg': 'var(--Black)',
        '--button-color': 'var(--White)',
        '--button-hover': 'var(--Elements-Twilight-60-50)',
      };
    case 'gray':
      if (variant === 'outline') {
        return {
          '--button-bg': 'transparent',
          '--button-color': 'var(--Black)',
          '--button-hover-color': 'var(--Black)',
          '--button-hover': 'transparent',
          '--button-bd': '1px solid var(--Elements-Twilight-5-80)',
          '--button-bd-hover': 'var(--Elements-Twilight-30-60)',
        };
      }
      return {
        '--button-bg': 'var(--Elements-Twilight-5-80)',
        '--button-color': 'var(--Black)',
        '--button-hover': 'var(--Elements-Twilight-30-70)',
      };
    case 'green':
      return {
        '--button-bg': 'var(--Elements-Green-60-Alpha)',
        '--button-color': 'var(--Elements-Twilight-100-0)',
        '--button-hover': 'var(--Elements-Green-100-140)',
      };
    case 'dark':
      return {
        '--button-bg': 'var(--Elements-Neb-Compl-100)',
        '--button-color': 'var(--White)',
        '--button-hover': 'var(--Elements-Neb-Ultra-Super)',
      };
    default:
      return {};
  }
}

function disabledButtonStyles(color: string, variant: string): CSSProperties {
  if (variant === 'subtle') {
    return {
      opacity: 1,
      background: 'var(--Elements-Twilight-5-80)',
      color: 'var(--Elements-Twilight-40-60)',
      borderColor: 'transparent',
    };
  }

  switch (color) {
    case 'primary':
      return {
        opacity: 0.4,
        background: 'var(--Elements-Neb-100-Twilight-60)',
        color: 'var(--Black)',
      };
    case 'danger':
      return {
        opacity: 1,
        background: 'var(--Elements-Red-Dark-Alpha)',
        color: 'var(--Elements-Twilight-60-40)',
        borderColor: 'transparent',
      };
    case 'black':
      if (variant === 'outline') {
        return {
          opacity: 1,
          background: 'var(--Elements-Twilight-5-80)',
          color: 'var(--Elements-Twilight-40-60)',
          borderColor: 'transparent',
        };
      }
      return {
        opacity: 1,
        background: 'var(--Elements-Twilight-30-70)',
        color: 'var(--Elements-Twilight-60-40)',
        borderColor: 'transparent',
      };
    default:
      return {};
  }
}

function buttonRadiusVars(variant: string): ButtonRootVars {
  if (variant === 'comic') {
    return {
      '--button-radius': rem(50),
    };
  }

  return {};
}

function alertColorVars(color: string, variant: string): AlertRootVars {
  switch (color) {
    case 'success':
      return {
        '--alert-bg':
          variant === 'outline'
            ? 'transparent'
            : 'var(--Elements-Green-20-Alpha)',
        '--alert-color': 'var(--Elements-Green-140-100)',
        '--alert-bd':
          variant === 'outline'
            ? `${rem(1)} solid var(--Elements-Green-120)`
            : 'none',
      };
    case 'warning':
      return {
        '--alert-bg':
          variant === 'outline'
            ? 'transparent'
            : 'var(--Elements-Orange-20-Alpha)',
        '--alert-color': 'var(--Elements-Orange-120-100)',
        '--alert-bd':
          variant === 'outline' ? `${rem(1)} solid var(--orange)` : 'none',
      };
    case 'danger':
      if (variant === 'outline') {
        return {
          '--alert-bg': 'transparent',
          '--alert-color': 'var(--Elements-Red-110-60)',
          '--alert-bd': `${rem(1)} solid var(--Elements-Red-110)`,
        };
      }
      return {
        '--alert-bg':
          variant === 'filled'
            ? 'var(--Elements-Red-110-60)'
            : 'var(--Elements-Red-20-Alpha)',
        '--alert-color':
          variant === 'filled'
            ? 'var(--Color-White)'
            : 'var(--Elements-Red-110-60)',
      };
    case 'neutral-blue':
      if (variant === 'outline') {
        return {
          '--alert-bg': 'transparent',
          '--alert-color': 'var(--Elements-Blue-120-100)',
          '--alert-bd': `${rem(1)} solid var(--Elements-Blue-100)`,
        };
      }
      return {
        '--alert-bg':
          variant === 'filled'
            ? 'var(--Elements-Blue-100)'
            : 'var(--Elements-Blue-20-Alpha)',
        '--alert-color':
          variant === 'filled'
            ? 'var(--Color-White)'
            : 'var(--Elements-Blue-120-100)',
      };
    case 'blue':
      if (variant === 'outline') {
        return {
          '--alert-bg': 'transparent',
          '--alert-color': 'var(--Elements-Neb-Ultra-Super)',
          '--alert-bd': `${rem(1)} solid var(--Elements-Neb-Ultra)`,
        };
      }
      return {
        '--alert-bg':
          variant === 'filled'
            ? 'var(--Elements-Neb-Ultra)'
            : 'var(--Elements-Neb-30-Alpha)',
        '--alert-color':
          variant === 'filled'
            ? 'var(--Color-White)'
            : 'var(--Elements-Neb-Ultra-Super)',
      };
    default:
      throw new Error(`"${color}" is not an allowed alert color`);
  }
}

function sliderVars(): SliderRootVars {
  return {
    '--slider-thumb-size': 'calc(var(--slider-size) * 2.5)',
    '--slider-radius': rem(999),
    '--slider-color': 'var(--Elements-Neb-Ultra-Super)',
  };
}

function buttonSizeClassString(size: 'md' | 'sm' | 'xs') {
  const buttonSizeClasses = {
    md: ['h-10', 'px-[22px]', 'text-[16px]'],
    sm: ['h-9', 'px-[18px]', 'text-[14px]'],
    xs: ['h-7', 'px-[14px]', 'text-[12px]'],
  };

  return buttonSizeClasses[size]
    .map((className) => `[&>button]:!${className}`)
    .join(' ');
}

export default handbookTheme;
