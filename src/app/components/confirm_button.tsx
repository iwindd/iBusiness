import React from 'react'
import { setTimeout } from 'timers';

const ConfirmButton = (props: {
  className?: string,
  className2?: string,
  label: string,
  label2: string,
  disabled?:boolean,
  duration?: number,
  onClick: () => void
}) => {
  const [state, setState] = React.useState<boolean>(false);
  const handle = () => {
    if (state) {
      props.onClick()
      setState(false);
      return
    }

    setState(true);
    setTimeout(() => {
      setState(false)
    }, props.duration || 1000)
  }

  return (
    <button
      type="button"
      className={!state ? props.className : props.className2 || props.className}
      onClick={handle}
      disabled={props.disabled}
    >
      {!state ? props.label : props.label2}
    </button>
  )
}

export default ConfirmButton