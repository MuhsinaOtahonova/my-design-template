// Foundations
export { Icon, iconNames, type IconProps } from "./Icon";
export { Heading, Text, Overline, Link, Code, CodeBlock, Kbd, type HeadingProps, type TextProps } from "./Typography";
export { Stack, Inline, Grid, Container, Divider, type StackProps, type GridProps } from "./Layout";
export { ThemeProvider, useTheme, applyBrand, type Theme } from "./Theme";

// Actions
export { Button, ButtonLink, IconButton, ButtonGroup, addRipple, type ButtonProps, type IconButtonProps, type ButtonVariant, type ControlSize } from "./Button";

// Forms
export {
  Field,
  Input,
  SearchInput,
  Textarea,
  Select,
  Checkbox,
  Radio,
  RadioGroup,
  Switch,
  Slider,
  RangeSlider,
  SegmentedControl,
  NumberInput,
  PinInput,
  FileUpload,
  type FieldProps,
  type InputProps,
  type TextareaProps,
  type SelectProps,
  type SelectOption,
  type SliderProps,
} from "./Form";

// Data display
export {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  MediaCard,
  Badge,
  StatusBadge,
  Tag,
  Avatar,
  AvatarGroup,
  UserCell,
  Stat,
  List,
  ListItem,
  DescriptionList,
  Timeline,
  EmptyState,
  ProfileCard,
  ProfileHeader,
  type CardProps,
  type Tone,
  type ProfileCardProps,
} from "./Display";
export { Table, Calendar, Carousel, BarChart, Sparkline, DonutChart, type Column, type TableProps } from "./Data";

// Feedback
export { Alert, Progress, CircularProgress, Spinner, Skeleton, Tooltip, Toast, ToastProvider, useToast, type FeedbackTone } from "./Feedback";

// Overlays
export { Modal, Drawer, Popover, Menu, type ModalProps, type MenuItem } from "./Overlay";

// Navigation & app shell
export { Tabs, Breadcrumbs, Pagination, Steps, Accordion, Sidebar, NavSection, NavItem, Topbar, BottomNav, Logo, type TabItem } from "./Navigation";

// Advanced (inspired by large enterprise systems)
export {
  CommandPalette,
  useHotkey,
  Combobox,
  MultiSelect,
  TagInput,
  DateRangeInput,
  TreeList,
  ContextMenu,
  InfoTip,
  HoverCard,
  Toolbar,
  ToolbarDivider,
  ToggleButton,
  Timestamp,
  relativeTime,
  StatusDot,
  SelectableCards,
  ChatThread,
  ChatMessage,
  ChatComposer,
  Lightbox,
  Blockquote,
  type Command,
  type ComboOption,
  type TreeNode,
  type LightboxItem,
} from "./Advanced";

// Motion & depth
export {
  Reveal,
  RevealGroup,
  AnimatedNumber,
  TiltCard,
  TiltLayer,
  SpotlightCard,
  CardStack,
  HoldButton,
  SplitButton,
  SpeedDial,
  CopyButton,
  useInView,
  prefersReducedMotion,
  type RevealEffect,
} from "./Motion";
export { IconGrid, IconTile, type IconTileProps } from "./IconGrid";

export { tokens } from "@my-design/tokens";
