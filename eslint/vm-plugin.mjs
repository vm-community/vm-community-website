/**
 * Local ESLint plugin enforcing the design-system and i18n contract:
 *  - vm/no-raw-design-literals: no hex/rgb/hsl colours, no raw px sizes, no Tailwind arbitrary
 *    values in TS/TSX strings (tokens live only in src/styles/*).
 *  - vm/no-jsx-literal-strings: no user-facing string literals in JSX (text nodes and the
 *    user-facing attributes); copy lives in message catalogs or vertical presets/content files.
 */

const HEX = /#[0-9a-fA-F]{3,8}\b/;
const FUNC_COLOR = /\b(?:rgba?|hsla?|oklch|oklab)\(/;
const RAW_PX = /(?:^|[^\w-])\d+(?:\.\d+)?px\b/;
const ARBITRARY = /(?:^|\s)[a-z-]+-\[[^\]\s]+\](?:\s|$)/;

function checkString(context, node, value) {
  if (typeof value !== 'string' || value.length === 0) return;
  if (HEX.test(value) || FUNC_COLOR.test(value)) {
    context.report({ node, messageId: 'colour' });
    return;
  }
  if (RAW_PX.test(value)) {
    context.report({ node, messageId: 'px' });
    return;
  }
  if (ARBITRARY.test(value)) {
    context.report({ node, messageId: 'arbitrary' });
  }
}

const noRawDesignLiterals = {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow raw colour/size literals and Tailwind arbitrary values' },
    messages: {
      colour: 'Raw colour literal. Use a token (src/styles/tokens.*) or a token-mapped utility.',
      px: 'Raw pixel size. Use a spacing/layout token or a token-mapped utility.',
      arbitrary: 'Tailwind arbitrary value. Use a token-mapped utility instead.',
    },
    schema: [],
  },
  create(context) {
    return {
      Literal(node) {
        if (typeof node.value === 'string') checkString(context, node, node.value);
      },
      TemplateElement(node) {
        checkString(context, node, node.value.cooked ?? node.value.raw);
      },
    };
  },
};

const USER_FACING_ATTRS = new Set([
  'aria-label',
  'aria-description',
  'aria-placeholder',
  'aria-roledescription',
  'aria-valuetext',
  'title',
  'placeholder',
  'alt',
  'label',
]);
const HAS_LETTERS = /\p{L}/u;

const noJsxLiteralStrings = {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow user-facing string literals in JSX' },
    messages: {
      text: 'User-facing text literal in JSX. Use the message catalog (useTranslations) or vocabulary resolver.',
      attr: 'User-facing attribute "{{name}}" with a string literal. Use the message catalog.',
    },
    schema: [],
  },
  create(context) {
    return {
      JSXText(node) {
        if (HAS_LETTERS.test(node.value)) context.report({ node, messageId: 'text' });
      },
      JSXExpressionContainer(node) {
        const expr = node.expression;
        if (
          node.parent &&
          (node.parent.type === 'JSXElement' || node.parent.type === 'JSXFragment') &&
          expr &&
          expr.type === 'Literal' &&
          typeof expr.value === 'string' &&
          HAS_LETTERS.test(expr.value)
        ) {
          context.report({ node, messageId: 'text' });
        }
      },
      JSXAttribute(node) {
        const name = node.name && node.name.name;
        if (typeof name !== 'string' || !USER_FACING_ATTRS.has(name)) return;
        const v = node.value;
        if (!v) return;
        if (v.type === 'Literal' && typeof v.value === 'string' && HAS_LETTERS.test(v.value)) {
          context.report({ node, messageId: 'attr', data: { name } });
        } else if (
          v.type === 'JSXExpressionContainer' &&
          v.expression.type === 'Literal' &&
          typeof v.expression.value === 'string' &&
          HAS_LETTERS.test(v.expression.value)
        ) {
          context.report({ node, messageId: 'attr', data: { name } });
        }
      },
    };
  },
};

const plugin = {
  meta: { name: 'vm', version: '1.0.0' },
  rules: {
    'no-raw-design-literals': noRawDesignLiterals,
    'no-jsx-literal-strings': noJsxLiteralStrings,
  },
};

export default plugin;
