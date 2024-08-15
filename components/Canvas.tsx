// Canvas.js
'use client';

// Canvas.js


import React, { useState } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

// Initial sample data for cards
const initialCards = [
  { id: 1, text: 'This is a card with some text.', x: 50, y: 50, width: 200, height: 100 },
  { id: 2, text: 'Another card with more text.', x: 300, y: 150, width: 200, height: 100 },
];

const Canvas = () => {
  const [cards, setCards] = useState(initialCards);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState('');

  const handleDrag = (index: number, e: DraggableEvent, data: DraggableData) => {
    setCards((prevCards) => {
      const newCards = [...prevCards];
      newCards[index] = { ...newCards[index], x: data.x, y: data.y };
      return newCards;
    });
  };

  const handleResize = (index: number, event: React.SyntheticEvent<Element, Event>, { size }: { size: { width: number; height: number; }; }) => {
    setCards((prevCards) => {
      const newCards = [...prevCards];
      newCards[index] = { ...newCards[index], width: size.width, height: size.height };
      return newCards;
    });
  };

  const handleShowMore = (text: React.SetStateAction<string>) => {
    setModalContent(text);
    setShowModal(true);
  };

  const handleEditClick = (index: number | React.SetStateAction<null>) => {
    setEditIndex(index);
    setEditText(cards[index].text);
  };

  const handleTextChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setEditText(e.target.value);
  };

  const handleSaveEdit = () => {
    setCards((prevCards) => {
      const newCards = [...prevCards];
      newCards[editIndex].text = editText;
      return newCards;
    });
    setEditIndex(null);
  };

  const addNewCard = () => {
    const newCardId = cards.length + 1;
    const newCard = {
      id: newCardId,
      text: `This is card number ${newCardId}. Here is some more dummy text to show.`,
      x: Math.random() * 400,
      y: Math.random() * 400,
      width: 200,
      height: 100,
    };
    setCards((prevCards) => [...prevCards, newCard]);
  };

  return (
    <div className="w-full h-screen overflow-auto relative bg-gray-200 text-black p-4">
      <button
        onClick={addNewCard}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
      >
        Add New Card
      </button>

      {cards.map((card, index) => (
        <React.Fragment key={card.id}>
          <Draggable
            position={{ x: card.x, y: card.y }}
            onStop={(e, data) => handleDrag(index, e, data)}
          >
            <div
              className="absolute"
              style={{ width: card.width, height: card.height }}
            >
              <ResizableBox
                width={card.width}
                height={card.height}
                minConstraints={[100, 50]}
                maxConstraints={[500, 300]}
                onResizeStop={(event, { size }) => handleResize(index, event, { size })}
                className="border border-gray-300 bg-white rounded-lg overflow-hidden p-3 box-border shadow-md"
              >
                <div className="w-full h-full">
                  {editIndex === index ? (
                    <div>
                      <textarea
                        value={editText}
                        onChange={handleTextChange}
                        className="w-full h-full p-2 border border-gray-300 rounded"
                      />
                      <button
                        className="mt-2 text-white bg-green-500 hover:bg-green-600 px-2 py-1 rounded"
                        onClick={handleSaveEdit}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <p
                      className="text-sm cursor-pointer"
                      onClick={() => handleEditClick(index)}
                    >
                      {card.text.substring(0, 20)}...{' '}
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => handleShowMore(card.text)}
                      >
                        Show More
                      </button>
                    </p>
                  )}
                </div>
              </ResizableBox>
            </div>
          </Draggable>

          {index < cards.length - 1 && (
            <svg
              className="absolute pointer-events-none"
              style={{
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                overflow: 'visible',
              }}
            >
              <defs>
                <marker
                  id={`arrowhead-${index}`}
                  markerWidth="10"
                  markerHeight="7"
                  refX="10"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#333" />
                </marker>
              </defs>
              <line
                x1={card.x + card.width / 2}
                y1={card.y + card.height / 2}
                x2={cards[index + 1].x + cards[index + 1].width / 2}
                y2={cards[index + 1].y + cards[index + 1].height / 2}
                stroke="#333"
                strokeWidth="2"
                markerEnd={`url(#arrowhead-${index})`}
              />
            </svg>
          )}
        </React.Fragment>
      ))}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-semibold mb-4">Card Details</h2>
            <p>{modalContent}</p>
            <button
              className="mt-4 text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Canvas;