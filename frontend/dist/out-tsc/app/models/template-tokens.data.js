/**
 * Template tokens for all 30 templates
 * Generated based on template style characteristics
 */
export const TEMPLATE_TOKENS = {
    'jr-even': {
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        fontSize: { body: 14, heading: 19, small: 12 }, // 增大字体
        lineHeight: 1.6,
        palette: {
            primary: '#3498db', // 蓝色
            text: '#2c3e50',
            muted: '#7f8c8d',
            bg: '#ffffff',
            border: '#ecf0f1'
        },
        layout: {
            columns: 1,
            sidebar: null,
            sidebarWidth: null,
            headerAlign: 'left',
            sectionHeadingStyle: 'bar', // 改为bar样式
            bulletStyle: 'dot'
        },
        spacing: { section: 20, item: 10 },
        letter: { marginTop: 40, marginSides: 50, signatureGap: 30 }
    },
    'jr-elegant': {
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: { body: 13, heading: 17, small: 11 }, // 增大字体
        lineHeight: 1.6,
        palette: {
            primary: '#34495e', // 深蓝灰色
            text: '#2c3e50',
            muted: '#95a5a6',
            bg: '#f9f9f9',
            border: '#dfe6e9'
        },
        layout: {
            columns: 2, // 改为双栏
            sidebar: 'left', // 左侧边栏
            sidebarWidth: '32%',
            headerAlign: 'left',
            sectionHeadingStyle: 'rule',
            bulletStyle: 'dash'
        },
        spacing: { section: 20, item: 12 },
        letter: { marginTop: 45, marginSides: 55, signatureGap: 35 }
    },
    'jr-flat': {
        fontFamily: '"Lato", sans-serif',
        fontSize: { body: 10, heading: 13, small: 8 },
        lineHeight: 1.3,
        palette: {
            primary: '#3498db',
            text: '#2c3e50',
            muted: '#bdc3c7',
            bg: '#ffffff',
            border: '#ecf0f1'
        },
        layout: {
            columns: 1,
            sidebar: null,
            sidebarWidth: null,
            headerAlign: 'left',
            sectionHeadingStyle: 'caps',
            bulletStyle: 'none'
        },
        spacing: { section: 14, item: 6 },
        letter: { marginTop: 35, marginSides: 45, signatureGap: 25 }
    },
    'jr-paper': {
        fontFamily: '"Courier New", monospace',
        fontSize: { body: 10, heading: 12, small: 8 },
        lineHeight: 1.4,
        palette: {
            primary: '#34495e',
            text: '#2c3e50',
            muted: '#7f8c8d',
            bg: '#fefefe',
            border: '#d5dbdb'
        },
        layout: {
            columns: 1,
            sidebar: null,
            sidebarWidth: null,
            headerAlign: 'left',
            sectionHeadingStyle: 'rule',
            bulletStyle: 'dash'
        },
        spacing: { section: 20, item: 10 },
        letter: { marginTop: 50, marginSides: 60, signatureGap: 40 }
    },
    'jr-paperpp': {
        fontFamily: 'Arial, sans-serif',
        fontSize: { body: 11, heading: 14, small: 9 },
        lineHeight: 1.5,
        palette: {
            primary: '#16a085',
            text: '#2c3e50',
            muted: '#95a5a6',
            bg: '#ffffff',
            border: '#ecf0f1'
        },
        layout: {
            columns: 1,
            sidebar: null,
            sidebarWidth: null,
            headerAlign: 'left',
            sectionHeadingStyle: 'caps',
            bulletStyle: 'dot'
        },
        spacing: { section: 16, item: 8 },
        letter: { marginTop: 40, marginSides: 50, signatureGap: 30 }
    },
    'jr-microdata': {
        fontFamily: 'Verdana, sans-serif',
        fontSize: { body: 10, heading: 13, small: 8 },
        lineHeight: 1.4,
        palette: {
            primary: '#e74c3c',
            text: '#2c3e50',
            muted: '#95a5a6',
            bg: '#ffffff',
            border: '#ecf0f1'
        },
        layout: {
            columns: 1,
            sidebar: null,
            sidebarWidth: null,
            headerAlign: 'left',
            sectionHeadingStyle: 'caps',
            bulletStyle: 'dot'
        },
        spacing: { section: 15, item: 7 },
        letter: { marginTop: 38, marginSides: 48, signatureGap: 28 }
    },
    'jr-kendall': {
        fontFamily: '"Roboto", sans-serif',
        fontSize: { body: 11, heading: 14, small: 9 },
        lineHeight: 1.4,
        palette: {
            primary: '#27ae60',
            text: '#2c3e50',
            muted: '#7f8c8d',
            bg: '#ffffff',
            border: '#dfe6e9'
        },
        layout: {
            columns: 2,
            sidebar: 'left',
            sidebarWidth: '30%',
            headerAlign: 'left',
            sectionHeadingStyle: 'bar',
            bulletStyle: 'dot'
        },
        spacing: { section: 18, item: 9 },
        letter: { marginTop: 40, marginSides: 50, signatureGap: 30 }
    },
    'jr-classy': {
        fontFamily: 'Georgia, serif',
        fontSize: { body: 11, heading: 15, small: 9 },
        lineHeight: 1.6,
        palette: {
            primary: '#8e44ad',
            text: '#2c3e50',
            muted: '#95a5a6',
            bg: '#ffffff',
            border: '#ecf0f1'
        },
        layout: {
            columns: 1,
            sidebar: null,
            sidebarWidth: null,
            headerAlign: 'center',
            sectionHeadingStyle: 'rule',
            bulletStyle: 'dash'
        },
        spacing: { section: 20, item: 10 },
        letter: { marginTop: 50, marginSides: 60, signatureGap: 40 }
    },
    'jr-compact': {
        fontFamily: 'Arial, sans-serif',
        fontSize: { body: 12, heading: 16, small: 10 }, // 大幅增大字体
        lineHeight: 1.4,
        palette: {
            primary: '#e67e22', // 橙色
            text: '#2c3e50',
            muted: '#7f8c8d',
            bg: '#ffffff',
            border: '#ecf0f1'
        },
        layout: {
            columns: 1,
            sidebar: null,
            sidebarWidth: null,
            headerAlign: 'left',
            sectionHeadingStyle: 'bar',
            bulletStyle: 'dot'
        },
        spacing: { section: 16, item: 8 },
        letter: { marginTop: 30, marginSides: 40, signatureGap: 20 }
    },
    'jr-modern': {
        fontFamily: '"Open Sans", sans-serif',
        fontSize: { body: 13, heading: 18, small: 11 }, // 增大字体
        lineHeight: 1.6,
        palette: {
            primary: '#a0522d', // 深棕红色 (sienna)
            text: '#2c3e50',
            muted: '#7f8c8d',
            bg: '#ffffff',
            border: '#ecf0f1'
        },
        layout: {
            columns: 2, // 改为双栏
            sidebar: 'left', // 左侧边栏
            sidebarWidth: '30%', // 30%宽度
            headerAlign: 'left',
            sectionHeadingStyle: 'bar',
            bulletStyle: 'dot'
        },
        spacing: { section: 18, item: 10 },
        letter: { marginTop: 40, marginSides: 50, signatureGap: 30 }
    },
    'jr-slick': {
        fontFamily: '"Helvetica Neue", sans-serif',
        fontSize: { body: 11, heading: 15, small: 9 },
        lineHeight: 1.5,
        palette: {
            primary: '#e74c3c',
            text: '#2c3e50',
            muted: '#95a5a6',
            bg: '#ffffff',
            border: '#ecf0f1'
        },
        layout: {
            columns: 1,
            sidebar: null,
            sidebarWidth: null,
            headerAlign: 'left',
            sectionHeadingStyle: 'caps',
            bulletStyle: 'dash'
        },
        spacing: { section: 18, item: 9 },
        letter: { marginTop: 42, marginSides: 52, signatureGap: 32 }
    },
    'jr-timeline': {
        fontFamily: '"Segoe UI", sans-serif',
        fontSize: { body: 13, heading: 17, small: 11 }, // 增大字体
        lineHeight: 1.5,
        palette: {
            primary: '#16a085', // 青绿色
            text: '#2c3e50',
            muted: '#7f8c8d',
            bg: '#ffffff',
            border: '#bdc3c7'
        },
        layout: {
            columns: 2, // 改为双栏
            sidebar: 'left', // 左侧边栏
            sidebarWidth: '28%',
            headerAlign: 'left',
            sectionHeadingStyle: 'pill',
            bulletStyle: 'dot'
        },
        spacing: { section: 20, item: 12 },
        letter: { marginTop: 45, marginSides: 55, signatureGap: 35 }
    },
    'jr-techlead': {
        fontFamily: '"Source Sans Pro", sans-serif',
        fontSize: { body: 11, heading: 16, small: 9 },
        lineHeight: 1.4,
        palette: {
            primary: '#e67e22',
            text: '#2c3e50',
            muted: '#95a5a6',
            bg: '#ffffff',
            border: '#ecf0f1'
        },
        layout: {
            columns: 2,
            sidebar: 'left',
            sidebarWidth: '35%',
            headerAlign: 'left',
            sectionHeadingStyle: 'bar',
            bulletStyle: 'dot'
        },
        spacing: { section: 18, item: 9 },
        letter: { marginTop: 40, marginSides: 50, signatureGap: 30 }
    },
    'jr-onepage': {
        fontFamily: 'Arial, sans-serif',
        fontSize: { body: 10, heading: 12, small: 8 },
        lineHeight: 1.3,
        palette: {
            primary: '#3498db',
            text: '#2c3e50',
            muted: '#7f8c8d',
            bg: '#ffffff',
            border: '#ecf0f1'
        },
        layout: {
            columns: 1,
            sidebar: null,
            sidebarWidth: null,
            headerAlign: 'center',
            sectionHeadingStyle: 'caps',
            bulletStyle: 'dot'
        },
        spacing: { section: 12, item: 6 },
        letter: { marginTop: 35, marginSides: 45, signatureGap: 25 }
    },
    'jr-standard': {
        fontFamily: 'Times New Roman, serif',
        fontSize: { body: 11, heading: 14, small: 9 },
        lineHeight: 1.5,
        palette: {
            primary: '#2c3e50',
            text: '#2c3e50',
            muted: '#7f8c8d',
            bg: '#ffffff',
            border: '#ecf0f1'
        },
        layout: {
            columns: 1,
            sidebar: null,
            sidebarWidth: null,
            headerAlign: 'center',
            sectionHeadingStyle: 'rule',
            bulletStyle: 'dot'
        },
        spacing: { section: 16, item: 8 },
        letter: { marginTop: 40, marginSides: 50, signatureGap: 30 }
    },
    'jr-hired': {
        fontFamily: '"Montserrat", sans-serif',
        fontSize: { body: 11, heading: 15, small: 9 },
        lineHeight: 1.5,
        palette: {
            primary: '#e67e22',
            text: '#2c3e50',
            muted: '#95a5a6',
            bg: '#ffffff',
            border: '#ecf0f1'
        },
        layout: {
            columns: 1,
            sidebar: null,
            sidebarWidth: null,
            headerAlign: 'left',
            sectionHeadingStyle: 'pill',
            bulletStyle: 'dot'
        },
        spacing: { section: 18, item: 9 },
        letter: { marginTop: 42, marginSides: 52, signatureGap: 32 }
    },
    'jr-cvstrap': {
        fontFamily: '"Roboto", sans-serif',
        fontSize: { body: 11, heading: 14, small: 9 },
        lineHeight: 1.4,
        palette: {
            primary: '#2ecc71',
            text: '#34495e',
            muted: '#95a5a6',
            bg: '#ffffff',
            border: '#dfe6e9'
        },
        layout: {
            columns: 2,
            sidebar: 'left',
            sidebarWidth: '30%',
            headerAlign: 'left',
            sectionHeadingStyle: 'bar',
            bulletStyle: 'dot'
        },
        spacing: { section: 16, item: 8 },
        letter: { marginTop: 40, marginSides: 50, signatureGap: 30 }
    },
    'jr-tachyons': {
        fontFamily: 'system-ui, sans-serif',
        fontSize: { body: 10, heading: 13, small: 8 },
        lineHeight: 1.4,
        palette: {
            primary: '#357edd',
            text: '#2c3e50',
            muted: '#64707d',
            bg: '#ffffff',
            border: '#e7e9ed'
        },
        layout: {
            columns: 1,
            sidebar: null,
            sidebarWidth: null,
            headerAlign: 'left',
            sectionHeadingStyle: 'caps',
            bulletStyle: 'dot'
        },
        spacing: { section: 14, item: 7 },
        letter: { marginTop: 38, marginSides: 48, signatureGap: 28 }
    },
    'jr-stackoverflowed': {
        fontFamily: 'Arial, sans-serif',
        fontSize: { body: 11, heading: 14, small: 9 },
        lineHeight: 1.4,
        palette: {
            primary: '#f48024',
            text: '#2c3e50',
            muted: '#9199a1',
            bg: '#ffffff',
            border: '#d6d9dc'
        },
        layout: {
            columns: 1,
            sidebar: null,
            sidebarWidth: null,
            headerAlign: 'left',
            sectionHeadingStyle: 'pill',
            bulletStyle: 'dot'
        },
        spacing: { section: 16, item: 8 },
        letter: { marginTop: 40, marginSides: 50, signatureGap: 30 }
    },
    'jr-dev-ats': {
        fontFamily: 'Calibri, sans-serif',
        fontSize: { body: 13, heading: 17, small: 11 }, // 增大字体
        lineHeight: 1.5,
        palette: {
            primary: '#0077b5', // LinkedIn蓝
            text: '#000000',
            muted: '#666666',
            bg: '#ffffff',
            border: '#cccccc'
        },
        layout: {
            columns: 1,
            sidebar: null,
            sidebarWidth: null,
            headerAlign: 'left',
            sectionHeadingStyle: 'bar',
            bulletStyle: 'dot'
        },
        spacing: { section: 18, item: 9 },
        letter: { marginTop: 36, marginSides: 46, signatureGap: 26 }
    },
    'lt-awesomecv': {
        fontFamily: '"Source Sans Pro", sans-serif',
        fontSize: { body: 13, heading: 18, small: 11 }, // 增大字体
        lineHeight: 1.6,
        palette: {
            primary: '#0395de', // 蓝色侧边栏
            text: '#333333',
            muted: '#666666',
            bg: '#ffffff',
            border: '#e0e0e0'
        },
        layout: {
            columns: 2,
            sidebar: 'left',
            sidebarWidth: '30%', // 增大到30%
            headerAlign: 'left',
            sectionHeadingStyle: 'bar',
            bulletStyle: 'dot'
        },
        spacing: { section: 20, item: 10 },
        letter: { marginTop: 42, marginSides: 52, signatureGap: 32 }
    },
    'lt-altacv': {
        fontFamily: '"Lato", sans-serif',
        fontSize: { body: 13, heading: 17, small: 11 }, // 增大字体
        lineHeight: 1.5,
        palette: {
            primary: '#2ecc71', // 改为更鲜艳的绿色（像CVWizard的Casual）
            text: '#2c3e50',
            muted: '#7f8c8d',
            bg: '#ffffff',
            border: '#ecf0f1'
        },
        layout: {
            columns: 2,
            sidebar: 'right',
            sidebarWidth: '32%', // 调整宽度
            headerAlign: 'left',
            sectionHeadingStyle: 'pill',
            bulletStyle: 'dot'
        },
        spacing: { section: 18, item: 10 },
        letter: { marginTop: 40, marginSides: 50, signatureGap: 30 }
    },
    'lt-moderncv': {
        fontFamily: 'Georgia, serif',
        fontSize: { body: 14, heading: 19, small: 12 }, // 大幅增大字体
        lineHeight: 1.6,
        palette: {
            primary: '#2c5f8d', // 深蓝色
            text: '#2c3e50',
            muted: '#95a5a6',
            bg: '#ffffff',
            border: '#dfe6e9'
        },
        layout: {
            columns: 1,
            sidebar: null,
            sidebarWidth: null,
            headerAlign: 'left', // 改为左对齐
            sectionHeadingStyle: 'bar', // 改为bar样式
            bulletStyle: 'dot'
        },
        spacing: { section: 22, item: 12 },
        letter: { marginTop: 50, marginSides: 60, signatureGap: 40 }
    },
    'lt-friggeri': {
        fontFamily: '"Raleway", sans-serif',
        fontSize: { body: 13, heading: 17, small: 11 }, // 增大字体
        lineHeight: 1.5,
        palette: {
            primary: '#708090', // Slate gray - 更深的灰色
            text: '#2c3e50',
            muted: '#95a5a6',
            bg: '#ffffff',
            border: '#e1e4e8'
        },
        layout: {
            columns: 2,
            sidebar: 'left',
            sidebarWidth: '32%',
            headerAlign: 'left',
            sectionHeadingStyle: 'caps',
            bulletStyle: 'dot'
        },
        spacing: { section: 18, item: 10 },
        letter: { marginTop: 42, marginSides: 52, signatureGap: 32 }
    },
    'lt-deedy': {
        fontFamily: '"Ubuntu", sans-serif',
        fontSize: { body: 13, heading: 18, small: 11 }, // 增大字体
        lineHeight: 1.5,
        palette: {
            primary: '#c0504d', // 深橙红色（像CVWizard的Vertical）
            text: '#2c3e50',
            muted: '#7f8c8d',
            bg: '#ffffff',
            border: '#ecf0f1'
        },
        layout: {
            columns: 2,
            sidebar: 'right',
            sidebarWidth: '32%',
            headerAlign: 'left',
            sectionHeadingStyle: 'bar',
            bulletStyle: 'dot'
        },
        spacing: { section: 18, item: 10 },
        letter: { marginTop: 40, marginSides: 50, signatureGap: 30 }
    },
    'lt-twenty': {
        fontFamily: '"Raleway", sans-serif',
        fontSize: { body: 13, heading: 17, small: 11 }, // 增大字体
        lineHeight: 1.5,
        palette: {
            primary: '#e74c3c', // 更鲜艳的红色
            text: '#2c3e50',
            muted: '#95a5a6',
            bg: '#ffffff',
            border: '#ecf0f1'
        },
        layout: {
            columns: 2,
            sidebar: 'left',
            sidebarWidth: '30%', // 增大到30%
            headerAlign: 'left',
            sectionHeadingStyle: 'pill',
            bulletStyle: 'dot'
        },
        spacing: { section: 18, item: 10 },
        letter: { marginTop: 36, marginSides: 46, signatureGap: 26 }
    },
    'lt-altacv-dark': {
        fontFamily: '"Lato", sans-serif',
        fontSize: { body: 10, heading: 14, small: 8 },
        lineHeight: 1.4,
        palette: {
            primary: '#6a5acd',
            text: '#e8e8e8',
            muted: '#a8a8a8',
            bg: '#1e1e1e',
            border: '#333333'
        },
        layout: {
            columns: 2,
            sidebar: 'right',
            sidebarWidth: '35%',
            headerAlign: 'left',
            sectionHeadingStyle: 'pill',
            bulletStyle: 'dot'
        },
        spacing: { section: 16, item: 8 },
        letter: { marginTop: 40, marginSides: 50, signatureGap: 30 }
    },
    'lt-moderncv-casual': {
        fontFamily: 'sans-serif',
        fontSize: { body: 11, heading: 14, small: 9 },
        lineHeight: 1.5,
        palette: {
            primary: '#0e77b6',
            text: '#2c3e50',
            muted: '#95a5a6',
            bg: '#ffffff',
            border: '#dfe6e9'
        },
        layout: {
            columns: 1,
            sidebar: null,
            sidebarWidth: null,
            headerAlign: 'left',
            sectionHeadingStyle: 'rule',
            bulletStyle: 'dash'
        },
        spacing: { section: 18, item: 9 },
        letter: { marginTop: 42, marginSides: 52, signatureGap: 32 }
    },
    'lt-friggeri-boosted': {
        fontFamily: '"Raleway", sans-serif',
        fontSize: { body: 10, heading: 14, small: 8 },
        lineHeight: 1.4,
        palette: {
            primary: '#3d84a8',
            text: '#2c3e50',
            muted: '#95a5a6',
            bg: '#ffffff',
            border: '#e1e4e8'
        },
        layout: {
            columns: 2,
            sidebar: 'left',
            sidebarWidth: '33%',
            headerAlign: 'left',
            sectionHeadingStyle: 'bar',
            bulletStyle: 'dot'
        },
        spacing: { section: 18, item: 9 },
        letter: { marginTop: 42, marginSides: 52, signatureGap: 32 }
    },
    'lt-awesomecv-letter': {
        fontFamily: '"Source Sans Pro", sans-serif',
        fontSize: { body: 11, heading: 14, small: 9 },
        lineHeight: 1.5,
        palette: {
            primary: '#0395de',
            text: '#333333',
            muted: '#666666',
            bg: '#ffffff',
            border: '#e0e0e0'
        },
        layout: {
            columns: 1,
            sidebar: null,
            sidebarWidth: null,
            headerAlign: 'left',
            sectionHeadingStyle: 'caps',
            bulletStyle: 'none'
        },
        spacing: { section: 20, item: 12 },
        letter: { marginTop: 50, marginSides: 65, signatureGap: 45 }
    },
    // CVWizard-inspired templates
    'cw-classic': {
        fontFamily: 'Arial, sans-serif',
        fontSize: { body: 13, heading: 17, small: 11 },
        lineHeight: 1.6,
        palette: {
            primary: '#7f8c8d', // Medium gray
            text: '#2c3e50',
            muted: '#95a5a6',
            bg: '#ffffff',
            border: '#ecf0f1'
        },
        layout: {
            columns: 2,
            sidebar: 'left',
            sidebarWidth: '32%',
            headerAlign: 'left',
            sectionHeadingStyle: 'caps',
            bulletStyle: 'dot'
        },
        spacing: { section: 18, item: 10 },
        letter: { marginTop: 40, marginSides: 50, signatureGap: 30 }
    },
    'cw-horizontal': {
        fontFamily: 'Arial, sans-serif',
        fontSize: { body: 14, heading: 19, small: 12 },
        lineHeight: 1.6,
        palette: {
            primary: '#3498db', // Blue for top/bottom bars
            text: '#2c3e50',
            muted: '#7f8c8d',
            bg: '#ffffff',
            border: '#3498db'
        },
        layout: {
            columns: 1,
            sidebar: null,
            sidebarWidth: null,
            headerAlign: 'left',
            sectionHeadingStyle: 'bar',
            bulletStyle: 'dot'
        },
        spacing: { section: 20, item: 12 },
        letter: { marginTop: 40, marginSides: 50, signatureGap: 30 }
    },
    'cw-vertical': {
        fontFamily: 'Arial, sans-serif',
        fontSize: { body: 13, heading: 18, small: 11 },
        lineHeight: 1.6,
        palette: {
            primary: '#e74c3c', // Red for gradient sidebar
            text: '#2c3e50',
            muted: '#7f8c8d',
            bg: '#ffffff',
            border: '#e74c3c'
        },
        layout: {
            columns: 2, // Changed to 2 columns
            sidebar: 'left', // Left sidebar
            sidebarWidth: '30%', // 30% sidebar width
            headerAlign: 'left',
            sectionHeadingStyle: 'bar',
            bulletStyle: 'dot'
        },
        spacing: { section: 18, item: 10 },
        letter: { marginTop: 40, marginSides: 50, signatureGap: 30 }
    }
};
//# sourceMappingURL=template-tokens.data.js.map