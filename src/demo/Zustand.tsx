// import { create } from "zustand";
import _useStore from "../hooks/useStore";

function create<T extends Object>(
  fn: (set: (...args: any) => void, get: () => T) => T
) {
  const set = (value: (v: T) => T | T) => {
    const _value = typeof value === "function" ? value(state) : value;
    const pre = state;
    state = Object.assign({ ...state }, _value);
    if (subscribe && subscribe.length) {
      subscribe.forEach((fn: any) => fn(pre, state));
    }
  };
  const get = () => state;
  let state = fn(set, get);
  let subscribe = [] as any[];

  const api = {
    setState: set,
    getState: get,
    subscribe: (childe: any) => {
      subscribe.push(childe);
      return () => {
        subscribe = subscribe.filter((fn: any) => fn !== childe);
      };
    },
  };

  const useStore = (selector: (state: T) => T extends Record<string,infer A> ? A: T) =>
    _useStore<T>({ api, selector });
  Object.assign({ useStore }, api);
  return useStore;
}

type Store = {
  count: number;
  getCount: () => number;
  increase: () => void;
  reset: () => void;
};

const useStore = create<Store>((set, get) => ({
  count: 0,
  getCount: () => get().count,
  increase: () =>
    set((state: any) => ({
      count: state.count + 1,
    })),
  reset: () => set({ count: 0 }),
}));

const Counter = () => {
  const count = useStore((state) => state.count);
  const getCount = useStore((state) => state.getCount);
  console.log("Counter return");

  return (
    <div>
      <div>count:{count}</div>
      <div>getCount:{getCount()}</div>
    </div>
  );
};

export default function Zustand() {
  const increase = useStore((state) => state.increase);
  console.log("Zustand return");
//   console.log(Array.from('abcdefghijklmnopqrstuvwxyz'));
//   console.log(Array.from([1,2,3,4,5,6,7,8,9,10],(a)=>a*a));
//   console.log(Array.isArray({}));
//   console.log(Array.of<any>(1,'2',true,{},()=>{}));
//   console.log(Array.of());

//   const list = [1,2,3,4,5,6,7,8,9,10]
//   const arr = [2,4,6,8,10]
//   console.log(list.at(-1));
//   console.log(list.concat(arr));
//   console.log(list.copyWithin(-2, 1, 3));//会改变原数组
  
//   console.log(list.entries().next());
//   console.log(list.every((a)=>a>0));
//   console.log(list.fill(1,2,9));//会改变原数组
//   console.log(list.filter((a)=>a>1));
//   console.log(list.find((a)=>a>2));
//   console.log(list.findIndex((a)=>a>2));
//   //@ts-ignore
//   console.log(list.findLast((a)=>a>2));
//   //@ts-ignore
//   console.log(list.findLastIndex((a)=>a>2));
//   console.log([[list]].flat());
//   console.log(list.flatMap((a)=>[a,a]));
//   console.log(list.forEach((a)=>console.log(a)));
//   console.log(list.includes(10));
//   console.log(list.indexOf(10));
//   console.log(list.join('-'));
//   console.log(list.keys());
//   console.log(list.lastIndexOf(10));
//   console.log(list.map((a)=>a+3));
//   console.log(list.pop());//会改变原数组
//   console.log(list.push(21));//会改变原数组
//   console.log(list.reduce((a,b,i,j)=> a+b+i,0));
//   console.log(list.reduceRight((a,b,i,j)=> a+b+i,0));
//   console.log(list.reverse());//会改变原数组
//   console.log(list.shift());//会改变原数组
//   console.log(list.slice(3));
//   console.log(list.some((a)=>a>10));
//   console.log(list.sort((a,b)=>b-a));
//   console.log(list.splice(3,1,10));//会改变原数组
//   console.log(list.toLocaleString());
//   //@ts-ignore
//   console.log(list.toReversed());
//   //@ts-ignore
//   console.log(list.toSorted());
//   //@ts-ignore
//   console.log(list.toSpliced(2,1,10));
//   console.log(list.toString());
//   console.log(list.unshift(10));
//   console.log(list.values());
//    //@ts-ignore
//   console.log(list.with(0,1));
//   console.log(list);
  return (
    <>
      <div>
        <button onClick={increase}>Change Count</button>
        <Counter />
      </div>
    </>
  );
}
