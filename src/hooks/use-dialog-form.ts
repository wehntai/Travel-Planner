"use client";

import { useState, useTransition, type FormEvent } from "react";

export type DialogFormState = {
  error?: string;
  fieldErrors?: Partial<Record<string, string>>;
  success?: boolean;
};

/**
 * Drives a <form> against a server action without useActionState + an
 * effect to react to success — calling setState from inside an effect
 * just to react to a state flip trips React's "set state in effect"
 * warning. Handling the result in the submit handler (a real event)
 * avoids that, and leaves dialog open/close state to the caller so
 * dialogs opened from inside a dropdown menu can be controlled from
 * outside the menu tree (see comment in confirm-delete-dialog.tsx).
 */
export function useSubmitAction<S extends DialogFormState>(
  action: (prevState: S, formData: FormData) => Promise<S>,
  initialState: S,
  onSuccess: () => void,
) {
  const [state, setState] = useState<S>(initialState);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await action(state, formData);
      if (result.success) {
        setState(initialState);
        onSuccess();
      } else {
        setState(result);
      }
    });
  }

  function reset() {
    setState(initialState);
  }

  return { state, isPending, handleSubmit, reset };
}

/** Lets a component be used either controlled (open/onOpenChange passed in) or uncontrolled. */
export function useControllableOpen(open?: boolean, onOpenChange?: (open: boolean) => void) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  return {
    open: isControlled ? open : internalOpen,
    setOpen: isControlled ? onOpenChange! : setInternalOpen,
  };
}
