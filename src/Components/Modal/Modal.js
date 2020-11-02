import React, { useState, useEffect } from 'react';
import './Modal.scss';
import KanbanDB from 'kanbandb/dist/KanbanDB';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';

function ModalPopup(props) {
  const [modalText, setModalText] = useState(props.desc);
  const handleChange = (e) => {
    setModalText(e.target.value);
  };

  return (
    <Modal
      focusTrapped={false}
      modalId={props.id}
      open={props.openModal}
      showCloseIcon={false}
      center
      styles={{ background: 'rgba(0, 0, 0, 0.15) !important' }}
    >
      <h5>Description</h5>
      <textarea
        onChange={(e) => handleChange(e)}
        defaultValue={props.desc}
        id={props.id}
        name='textarea'
      ></textarea>
      <div
        style={{
          display: 'flex',
          marginTop: 10,
        }}
      >
        <button
          className='save'
          onClick={() => props.handleUpdateCard(modalText, props.card)}
        >
          Save
        </button>
        <button className='cancel' onClick={() => props.close()}>
          Cancel
        </button>
      </div>
    </Modal>
  );
}

export default ModalPopup;
