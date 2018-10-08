export interface DataTableColumn {
    title?: string;
    field?: string;
    width: number;
    align?: string;
    hidden?: boolean;
    fixed?: any;
    sortable?: boolean;
    className?: string;
    // 响应式属性
    media?: object;
    formatter?: () => {};
}
/**
 * 转换列的顺序
 * @param {DataTableColumn[]} 列数据
 * @param {string}   left|right 左固定或者右固定
 */
export const convertColumns = (columns, direction) => {
    const tempFixedColumns = [];
    const tempNotFixedColumns = [];
    columns.forEach(ele => {
        if (ele.fixed && ele.fixed === direction) {
            tempFixedColumns.push(ele);
        } else {
            tempNotFixedColumns.push(ele);
        }
    });
    return tempFixedColumns.concat(tempNotFixedColumns);
};
function typeOf(obj) {
    const toString = Object.prototype.toString;
    const map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object'
    };
    return map[toString.call(obj)];
}
/**
 *  对象或者数组深拷贝
 * @param {T} 源数据
 */
export const deepCopy = (data) => {
    const t = typeOf(data);
    let o;

    if (t === 'array') {
        o = [];
    } else if (t === 'object') {
        o = {};
    } else {
        return data;
    }

    if (t === 'array') {
        for (let i = 0; i < data.length; i++) {
            o.push(deepCopy(data[i]));
        }
    } else if (t === 'object') {
        for (const i of Object.keys(data)) {
            o[i] = deepCopy(data[i]);
        }
    }
    return o;
};



