import { createRef, useRef, useState } from 'react'

const useComponentRef = () => {
  const [componentRef] = useState(() => createRef())
  return componentRef
}

const setPromiseFunc = async (ref, func, ...param) => {
  if (ref.current) {
    return await ref.current[func](...param)
  }
}

const setFunc = (ref, func, ...param) => {
  if (ref.current) {
    return ref.current[func](...param)
  }
}

const getPromiseFunc = async (ref, func, ...param) => {
  if (ref.current) {
    if (param) return await ref.current[func](...param)
    else return await ref.current[func]()
  }
}

const getFunc = (ref, func, ...param) => {
  if (ref.current) {
    if (param) return ref.current[func](...param)
    else return ref.current[func]()
  }
}

const exePromiseFunc = async (ref, func, ...param) => {
  if (ref.current) {
    if (param) await ref.current[func](...param);
    else await ref.current[func]();
  }
}

const exeFunc = (ref, func, ...param) => {
  if (ref.current) {
    if (param) ref.current[func](...param)
    else ref.current[func]()
  }
}

export { useComponentRef, setPromiseFunc, setFunc, getPromiseFunc, getFunc, exePromiseFunc, exeFunc }
