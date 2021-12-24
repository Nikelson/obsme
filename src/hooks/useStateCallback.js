import { useCallback, useEffect, useRef, useState } from "react";

const useStateCallback = initialState => {
    const [state, setState] = useState(initialState);
    const cbRef = useRef(null);

    const setStateCallback = useCallback((state, callback) => {
        cbRef.current = callback;
        setState(state);
    }, []);

    useEffect(() => {
        if (cbRef.current) {
            cbRef.current(state);
            cbRef.current = null;
        }
    }, [state]);

    return [state, setStateCallback];
}

export default useStateCallback;