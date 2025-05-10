import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

export default function MainFeature() {
  // Icon declarations
  const PlusIcon = getIcon('Plus');
  const XIcon = getIcon('X');
  const EditIcon = getIcon('Edit2');
  const TrashIcon = getIcon('Trash2');
  const MoreHorizontalIcon = getIcon('MoreHorizontal');
  const MoveIcon = getIcon('Move');
  const ClockIcon = getIcon('Clock');
  const TagIcon = getIcon('Tag');

  // State for kanban board
  const [lists, setLists] = useState([
    {
      id: 'list-1',
      title: 'To Do',
      cards: [
        { id: 'card-1', title: 'Research competitors', description: 'Analyze top 5 competitors', labels: ['research'], due: '2023-12-10' },
        { id: 'card-2', title: 'Design landing page', description: 'Create wireframes', labels: ['design'], due: '2023-12-15' }
      ]
    },
    {
      id: 'list-2',
      title: 'In Progress',
      cards: [
        { id: 'card-3', title: 'Implement authentication', description: 'Set up user login and registration', labels: ['development', 'backend'], due: '2023-12-05' }
      ]
    },
    {
      id: 'list-3',
      title: 'Done',
      cards: [
        { id: 'card-4', title: 'Set up development environment', description: 'Install required dependencies', labels: ['setup'], due: '2023-11-28' }
      ]
    }
  ]);

  // State for dragging
  const [draggedCard, setDraggedCard] = useState(null);
  const [draggedList, setDraggedList] = useState(null);
  const [dragOverListId, setDragOverListId] = useState(null);
  
  // State for editing
  const [editingListId, setEditingListId] = useState(null);
  const [editingCardId, setEditingCardId] = useState(null);
  const [newListTitle, setNewListTitle] = useState('');
  const [showCardForm, setShowCardForm] = useState(null);
  const [newCardData, setNewCardData] = useState({ title: '', description: '', labels: [], due: '' });
  
  // Refs
  const listFormRef = useRef(null);
  const cardFormRef = useRef(null);
  
  // Label colors
  const labelColors = {
    'design': 'bg-purple-500',
    'development': 'bg-blue-500',
    'research': 'bg-yellow-500',
    'backend': 'bg-green-500',
    'frontend': 'bg-orange-500',
    'setup': 'bg-gray-500',
    'bug': 'bg-red-500',
    'feature': 'bg-indigo-500',
  };
  
  // Outside click handler for editing list title
  useEffect(() => {
    function handleClickOutside(event) {
      if (listFormRef.current && !listFormRef.current.contains(event.target)) {
        setEditingListId(null);
      }
      if (cardFormRef.current && !cardFormRef.current.contains(event.target)) {
        setShowCardForm(null);
        setNewCardData({ title: '', description: '', labels: [], due: '' });
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Handle list title edit
  const startEditingList = (listId, currentTitle) => {
    setEditingListId(listId);
    setNewListTitle(currentTitle);
  };
  
  const saveListTitle = (listId) => {
    if (newListTitle.trim()) {
      setLists(lists.map(list => 
        list.id === listId ? { ...list, title: newListTitle } : list
      ));
      toast.success('List title updated');
    }
    setEditingListId(null);
  };
  
  // Handle card creation and editing
  const openCardForm = (listId, cardData = null) => {
    setShowCardForm(listId);
    if (cardData) {
      setEditingCardId(cardData.id);
      setNewCardData({ ...cardData });
    } else {
      setEditingCardId(null);
      setNewCardData({ title: '', description: '', labels: [], due: '' });
    }
  };
  
  const saveCard = (listId) => {
    if (!newCardData.title.trim()) {
      toast.error('Card title is required');
      return;
    }
    
    if (editingCardId) {
      // Update existing card
      setLists(lists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            cards: list.cards.map(card => 
              card.id === editingCardId ? { ...card, ...newCardData } : card
            )
          };
        }
        return list;
      }));
      toast.success('Card updated');
    } else {
      // Create new card
      const newCard = {
        id: `card-${Date.now()}`,
        ...newCardData
      };
      
      setLists(lists.map(list => 
        list.id === listId 
          ? { ...list, cards: [...list.cards, newCard] } 
          : list
      ));
      toast.success('Card added');
    }
    
    setShowCardForm(null);
    setEditingCardId(null);
    setNewCardData({ title: '', description: '', labels: [], due: '' });
  };
  
  // Handle card deletion
  const deleteCard = (listId, cardId) => {
    setLists(lists.map(list => 
      list.id === listId 
        ? { ...list, cards: list.cards.filter(card => card.id !== cardId) } 
        : list
    ));
    toast.success('Card deleted');
  };
  
  // Add new list
  const addList = () => {
    const newList = {
      id: `list-${Date.now()}`,
      title: 'New List',
      cards: []
    };
    
    setLists([...lists, newList]);
    setTimeout(() => startEditingList(newList.id, newList.title), 100);
  };
  
  // Delete list
  const deleteList = (listId) => {
    setLists(lists.filter(list => list.id !== listId));
    toast.success('List deleted');
  };
  
  // Handle drag and drop
  const handleDragStart = (e, cardId, listId) => {
    setDraggedCard({ cardId, listId });
  };
  
  const handleListDragStart = (e, listId) => {
    setDraggedList(listId);
  };
  
  const handleDragOver = (e, listId) => {
    e.preventDefault();
    setDragOverListId(listId);
  };
  
  const handleDrop = (e, targetListId) => {
    e.preventDefault();
    
    if (draggedList !== null) {
      // Reorder lists
      const draggedListIndex = lists.findIndex(list => list.id === draggedList);
      const targetListIndex = lists.findIndex(list => list.id === targetListId);
      
      if (draggedListIndex !== targetListIndex) {
        const newLists = [...lists];
        const [removed] = newLists.splice(draggedListIndex, 1);
        newLists.splice(targetListIndex, 0, removed);
        setLists(newLists);
      }
    } else if (draggedCard !== null) {
      // Move card between lists
      const { cardId, listId: sourceListId } = draggedCard;
      
      if (sourceListId !== targetListId) {
        const sourceList = lists.find(list => list.id === sourceListId);
        const card = sourceList.cards.find(card => card.id === cardId);
        
        setLists(lists.map(list => {
          if (list.id === sourceListId) {
            return {
              ...list,
              cards: list.cards.filter(card => card.id !== cardId)
            };
          }
          if (list.id === targetListId) {
            return {
              ...list,
              cards: [...list.cards, card]
            };
          }
          return list;
        }));
        
        toast.info(`Card moved to ${lists.find(list => list.id === targetListId).title}`);
      }
    }
    
    setDraggedCard(null);
    setDraggedList(null);
    setDragOverListId(null);
  };
  
  // Handle toggle label
  const toggleLabel = (label) => {
    if (newCardData.labels.includes(label)) {
      setNewCardData({
        ...newCardData, 
        labels: newCardData.labels.filter(l => l !== label)
      });
    } else {
      setNewCardData({
        ...newCardData,
        labels: [...newCardData.labels, label]
      });
    }
  };

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <MoveIcon size={24} className="text-primary mr-2" />
          Interactive Kanban Board
        </h2>
        <button 
          onClick={addList}
          className="btn-primary text-sm"
        >
          <PlusIcon size={16} className="mr-1" />
          Add List
        </button>
      </div>
      
      <div className="overflow-x-auto pb-4 scrollbar-thin">
        <div className="flex gap-4 min-w-max">
          {lists.map(list => (
            <div 
              key={list.id}
              className={`w-80 shrink-0 rounded-xl ${dragOverListId === list.id ? 'bg-surface-200 dark:bg-surface-700' : 'bg-surface-100 dark:bg-surface-800'} transition-colors`}
              onDragOver={(e) => handleDragOver(e, list.id)}
              onDrop={(e) => handleDrop(e, list.id)}
              draggable
              onDragStart={(e) => handleListDragStart(e, list.id)}
            >
              <div className="p-3 flex justify-between items-center border-b border-surface-200 dark:border-surface-700">
                {editingListId === list.id ? (
                  <form 
                    ref={listFormRef}
                    onSubmit={(e) => {
                      e.preventDefault();
                      saveListTitle(list.id);
                    }}
                    className="flex-1"
                  >
                    <input
                      type="text"
                      value={newListTitle}
                      onChange={(e) => setNewListTitle(e.target.value)}
                      className="input w-full py-1 px-2 text-base font-medium"
                      autoFocus
                    />
                  </form>
                ) : (
                  <h3 
                    className="font-medium cursor-pointer hover:text-primary transition-colors px-1"
                    onClick={() => startEditingList(list.id, list.title)}
                  >
                    {list.title} <span className="text-surface-500 dark:text-surface-400 text-sm font-normal">({list.cards.length})</span>
                  </h3>
                )}
                
                <div className="flex gap-1">
                  <button 
                    onClick={() => openCardForm(list.id)}
                    className="p-1 rounded hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-300 transition-colors"
                    title="Add card"
                  >
                    <PlusIcon size={16} />
                  </button>
                  <button 
                    onClick={() => deleteList(list.id)}
                    className="p-1 rounded hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-300 transition-colors"
                    title="Delete list"
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              </div>
              
              <div className="p-2 max-h-[calc(100vh-250px)] overflow-y-auto scrollbar-thin">
                <AnimatePresence>
                  {list.cards.map(card => (
                    <motion.div
                      key={card.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={`bg-white dark:bg-surface-900 p-3 rounded-lg shadow-sm mb-2 
                        ${draggedCard?.cardId === card.id ? 'opacity-50' : 'opacity-100'}
                        border border-surface-200 dark:border-surface-700 hover:shadow-md transition-all`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, card.id, list.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{card.title}</h4>
                        <div className="flex gap-1">
                          <button 
                            onClick={() => openCardForm(list.id, card)}
                            className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-500 dark:text-surface-400 transition-colors"
                            title="Edit card"
                          >
                            <EditIcon size={14} />
                          </button>
                          <button 
                            onClick={() => deleteCard(list.id, card.id)}
                            className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-500 dark:text-surface-400 transition-colors"
                            title="Delete card"
                          >
                            <TrashIcon size={14} />
                          </button>
                        </div>
                      </div>
                      
                      {card.description && (
                        <p className="text-xs text-surface-600 dark:text-surface-400 mb-2">
                          {card.description}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-1 mb-2">
                        {card.labels && card.labels.map(label => (
                          <span 
                            key={label} 
                            className={`${labelColors[label] || 'bg-gray-500'} text-white text-xs px-2 py-0.5 rounded-full`}
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                      
                      {card.due && (
                        <div className="flex items-center text-xs text-surface-500 dark:text-surface-400">
                          <ClockIcon size={12} className="mr-1" />
                          <span>{new Date(card.due).toLocaleDateString()}</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {/* New Card Form */}
                <AnimatePresence>
                  {showCardForm === list.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="bg-white dark:bg-surface-900 p-3 rounded-lg shadow-md border border-surface-200 dark:border-surface-700"
                      ref={cardFormRef}
                    >
                      <div className="mb-3">
                        <input
                          type="text"
                          value={newCardData.title}
                          onChange={(e) => setNewCardData({...newCardData, title: e.target.value})}
                          placeholder="Card title"
                          className="input w-full py-1.5 text-sm"
                          autoFocus
                        />
                      </div>
                      
                      <div className="mb-3">
                        <textarea
                          value={newCardData.description}
                          onChange={(e) => setNewCardData({...newCardData, description: e.target.value})}
                          placeholder="Description (optional)"
                          className="input w-full py-1.5 text-sm min-h-[60px]"
                          rows={2}
                        />
                      </div>
                      
                      <div className="mb-3">
                        <label className="label text-xs flex items-center mb-1">
                          <TagIcon size={12} className="mr-1" />
                          Labels
                        </label>
                        <div className="flex flex-wrap gap-1">
                          {Object.keys(labelColors).map(label => (
                            <button
                              key={label}
                              type="button"
                              onClick={() => toggleLabel(label)}
                              className={`
                                text-xs px-2 py-0.5 rounded-full transition-all
                                ${newCardData.labels.includes(label) 
                                  ? `${labelColors[label]} text-white` 
                                  : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300'}
                              `}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="label text-xs flex items-center mb-1">
                          <ClockIcon size={12} className="mr-1" />
                          Due Date (optional)
                        </label>
                        <input
                          type="date"
                          value={newCardData.due || ''}
                          onChange={(e) => setNewCardData({...newCardData, due: e.target.value})}
                          className="input w-full py-1.5 text-sm"
                        />
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowCardForm(null);
                            setNewCardData({ title: '', description: '', labels: [], due: '' });
                          }}
                          className="btn-outline py-1 px-3 text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => saveCard(list.id)}
                          className="btn-primary py-1 px-3 text-sm"
                        >
                          {editingCardId ? 'Update' : 'Add'} Card
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {!showCardForm && list.cards.length === 0 && (
                  <button
                    onClick={() => openCardForm(list.id)}
                    className="w-full py-2 px-3 text-sm text-center rounded-lg text-surface-500 dark:text-surface-400 hover:bg-white dark:hover:bg-surface-900 border border-dashed border-surface-300 dark:border-surface-700 transition-colors"
                  >
                    <PlusIcon size={16} className="inline mr-1" />
                    Add a card
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {/* Add another list button (mobile only) */}
          <div className="md:hidden w-40 shrink-0 flex items-start">
            <button 
              onClick={addList}
              className="mt-2 p-2 rounded-lg bg-surface-200 dark:bg-surface-800 hover:bg-surface-300 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-300 transition-colors"
            >
              <PlusIcon size={20} className="mr-1" />
              Add List
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-4 md:mt-6 bg-primary/5 dark:bg-primary/10 rounded-xl p-4 md:p-6">
        <h3 className="text-lg font-medium mb-2">How to use this board:</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm md:text-base text-surface-700 dark:text-surface-300">
          <li>Drag and drop cards between lists</li>
          <li>Drag lists to reorder them</li>
          <li>Click on list titles to edit them</li>
          <li>Use the + button to add new cards to a list</li>
          <li>Click edit icon on cards to modify details</li>
        </ul>
      </div>
    </div>
  );
}