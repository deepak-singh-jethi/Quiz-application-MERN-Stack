import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const Modal = ({ isOpen, onClose, children, isLarge = false }) => {
  const modalRef = useRef();

  useEffect(() => {
    if (isOpen) {
      modalRef.current.style.display = "block";
    } else {
      modalRef.current.style.display = "none";
    }
  }, [isOpen]);

  return createPortal(
    <>
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className={`${isLarge ? "modal-large" : "modal"}`} ref={modalRef}>
        {children}
      </div>
    </>,
    document.getElementById("modal")
  );
};

export default Modal;
