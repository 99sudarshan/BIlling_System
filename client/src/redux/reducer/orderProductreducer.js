import {
  ADD_MAKE_ORDER_DETAIL,
  REMOVE_ALL_PRODUCT_DATA,
  ADD_PRODUCT_BY_CATEGORY,
  ADD_MAKE_ORDER_DETAIL_BY_TABLE_ID,
  ADD_PRODUCT_BY_CATEGORY_AND_ORDER_ID,
} from "../actions/actionsTypes";

const initialState = {
  all_products: [],
  order_item: [],
  categories: [],
  tables: [],
  company_info: [],
  category_id: "",
  edit_order: {},
};

const orderProductreducer = (state = initialState, actions) => {
  const { type, payload } = actions;
  switch (type) {
    case ADD_MAKE_ORDER_DETAIL_BY_TABLE_ID:
      return {
        ...state,
        order_item: payload.order_item,
        all_products: payload.products,
        categories: payload.categories,
        tables: payload.tables,
        category_id: payload.categories[0].id,
        company_info: payload.company_info,
        edit_order: payload.edit_order,
      };
    case ADD_PRODUCT_BY_CATEGORY:
      return {
        ...state,
        all_products: payload.products,
        order_item: payload.order_item,
        category_id: payload.category_id,
      };
    case ADD_PRODUCT_BY_CATEGORY_AND_ORDER_ID:
      return {
        ...state,
        all_products: payload.products,
        order_item: payload.order_item,
        category_id: payload.category_id,
      };
    case ADD_MAKE_ORDER_DETAIL:
      return {
        ...state,
        // all_products: payload.products,
        order_item: payload.order_item,
        categories: payload.categories,
        tables: payload.tables,
        company_info: payload.company_info,
      };
    case REMOVE_ALL_PRODUCT_DATA:
      return {
        ...state,
        all_products: [],
        order_item: [],
        categories: [],
        tables: [],
        company_info: [],
        category_id: "",
        edit_order: {},
      };
    default:
      return state;
  }
};

export default orderProductreducer;
