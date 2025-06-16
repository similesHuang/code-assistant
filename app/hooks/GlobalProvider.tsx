'use client';
import { createContext, useReducer } from "react";

type BaseAction = {
  type: string;
  payload?: unknown;
};

type Dispatch<Action extends BaseAction> = (action: Action) => void;
export type ProviderProps = {
  children: React.ReactNode;
};
export type StateType = {
  messages: MessageType[];
  inputValue: string;
  loading: boolean;
  selectedTab: string;
};
type ActionType =
  | { type: "ADD_MESSAGE"; payload: MessageType }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_INPUT_VALUE"; payload: string }
  | { type: "SET_SELECTED_TAB"; payload: string };

const chatReducer = (state: StateType, action: ActionType) => {
  switch (action.type) {
    case "ADD_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SET_INPUT_VALUE":
      return {
        ...state,
        inputValue: action.payload,
      };
    case "SET_SELECTED_TAB":
      return {
        ...state,
        selectedTab: action.payload,
      };
    default:
      return state;
  }
};

const DispatchContext = createContext<Dispatch<BaseAction>>(() => {});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StoreContext = createContext<Record<string, any>>({});
const GlobalProvider = ({ children }: ProviderProps) => {
  const [store, dispatch] = useReducer(chatReducer, {
    messages: [],
    inputValue: "",
    loading: false,
    selectedTab: "code",
  });
  return (
    <DispatchContext.Provider value={dispatch as Dispatch<BaseAction>}>
      <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    </DispatchContext.Provider>
  );
};
export default GlobalProvider;
