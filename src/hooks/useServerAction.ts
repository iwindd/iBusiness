import { useState, useEffect, useTransition, useRef } from 'react';

const useServerAction = <P, R>(
  action: ((_: P) => Promise<R>),
  onFinished?: ((_: R | undefined) => void)
): [(_: P) => Promise<R | undefined>, boolean] => {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<R>();
  const [finished, setFinished] = useState(false);
  const resolver = useRef<((value?: (R | PromiseLike<R>)) => void)>();


  useEffect(() => {
    if (!finished) return;

    if (onFinished) onFinished(result);
    resolver.current?.(result);

  }, [result, finished]);

  const runAction = async (args: P): Promise<R | undefined> => {
    startTransition(() => {
      action(args).then(data => {
        setResult(data);
        setFinished(true);
      });
    });

    return new Promise((resolve) => {
      resolver.current = resolve;
    });
  };

  return [runAction, isPending];
};

export default useServerAction