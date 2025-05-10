import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [userBoards, setUserBoards] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Icons
  const PlusIcon = getIcon('Plus');
  const BoardIcon = getIcon('LayoutGrid');
  const LoaderIcon = getIcon('Loader2');
  const CodeIcon = getIcon('Code');
  const BriefcaseIcon = getIcon('Briefcase');
  const BrainIcon = getIcon('Brain');
  const CheckSquareIcon = getIcon('CheckSquare');
  const TargetIcon = getIcon('Target');
  const RocketIcon = getIcon('Rocket');
  const HeartIcon = getIcon('Heart');
  const XIcon = getIcon('X');
  
  // Sample mock data - in a real app this would come from an API
  const sampleBoards = [
    { id: '1', title: 'Product Development', color: '#3b82f6', cards: 12, lastUpdated: new Date(Date.now() - 1000 * 60 * 60) },
    { id: '2', title: 'Marketing Campaign', color: '#10b981', cards: 8, lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24) },
    { id: '3', title: 'Client Projects', color: '#8b5cf6', cards: 5, lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 72) },
    { id: '4', title: 'Personal Tasks', color: '#ef4444', cards: 3, lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 168) }
  ];

  useEffect(() => {
    // Simulate loading data from an API
    setTimeout(() => {
      setUserBoards(sampleBoards);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Handle board creation
  const handleCreateBoard = (title, iconName) => {
    if (!title.trim()) {
      toast.error("Board title cannot be empty");
      return;
    }
    
    const newBoard = {
      id: `board-${Date.now()}`,
      title,
      iconName: iconName || 'LayoutGrid',
      cards: 0,
      lastUpdated: new Date()
    };
    
    setUserBoards([newBoard, ...userBoards]);
    setShowCreateModal(false);
    
    toast.success(`Board "${title}" created successfully`);
  };

  // Create board modal
  const CreateBoardModal = () => {
    const [boardTitle, setBoardTitle] = useState('');
    const [boardIcon, setBoardIcon] = useState('LayoutGrid');
    
    const iconOptions = [
      { name: 'LayoutGrid', color: 'text-blue-500' },
      { name: 'Code', color: 'text-green-500' },
      { name: 'Briefcase', color: 'text-purple-500' },
      { name: 'Brain', color: 'text-red-500' },
      { name: 'CheckSquare', color: 'text-amber-500' },
      { name: 'Rocket', color: 'text-pink-500' },
      { name: 'Heart', color: 'text-slate-500' },
    ];
    
    return (
      <AnimatePresence>
        {showCreateModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-xl max-w-md w-full p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Create New Board</h3>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200 transition-colors"
                >
                  <XIcon size={20} />
                </button>
              </div>
              
              <div className="mb-4">
                <label htmlFor="boardTitle" className="label">Board Title</label>
                <input
                  id="boardTitle"
                  type="text"
                  value={boardTitle}
                  onChange={e => setBoardTitle(e.target.value)}
                  placeholder="Enter board title..."
                  className="input w-full"
                  autoFocus
                />
              </div>
              
              <div className="mb-6">
                <label className="label">Board Icon</label>
                <div className="flex flex-wrap gap-2">
                  {iconOptions.map(icon => {
                    const IconComponent = getIcon(icon.name);
                    return (
                    <button
                      key={icon.name}
                      onClick={() => setBoardIcon(icon.name)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform ${icon.color} 
                        ${boardIcon === icon.name 
                          ? 'ring-2 ring-offset-2 ring-surface-900 dark:ring-surface-100 scale-110 bg-surface-100 dark:bg-surface-700' 
                          : 'hover:scale-110 bg-surface-50 dark:bg-surface-800'
                        }`}
                      aria-label={`Select icon ${icon.name}`}
                      title={icon.name}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleCreateBoard(boardTitle, boardIcon)}
                  disabled={!boardTitle.trim()}
                  className="btn-primary"
                >
                  Create Board
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // Format date for display
  const formatDate = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white dark:bg-surface-800 shadow-sm border-b border-surface-200 dark:border-surface-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BoardIcon className="text-primary" size={28} />
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              TaskFlow
            </h1>
          </div>
          
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            <PlusIcon size={18} className="mr-1" />
            <span className="hidden sm:inline">New Board</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Recent Boards */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Boards</h2>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <LoaderIcon size={40} className="text-primary" />
              </motion.div>
            </div>
          ) : userBoards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {userBoards.map(board => (
                <motion.div 
                  key={board.id}
                  whileHover={{ y: -5 }}
                  className="card hover:shadow-lg cursor-pointer transition-all duration-200"
                  onClick={() => toast.info(`Opening "${board.title}" board`, {
                    position: "bottom-center"
                  })}
                >
                  whileTap={{ scale: 0.98 }}
                  <div 
                  <div className="p-3 border-b border-surface-200 dark:border-surface-700 flex items-center gap-2">
                    {(() => {
                      const BoardIconComponent = getIcon(board.iconName || 'LayoutGrid');
                      return (
                        <BoardIconComponent 
                          size={20} 
                          className={board.iconName === 'LayoutGrid' ? 'text-blue-500' : ''} 
                        />
                      );
                    })()}
                  <div className="p-4">
                    <h3 className="font-medium text-lg mb-2">{board.title}</h3>
                    <div className="flex justify-between text-sm text-surface-500 dark:text-surface-400">
                      <span>{board.cards} cards</span>
                      <span>Updated {formatDate(board.lastUpdated)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-surface-100 dark:bg-surface-800 rounded-xl border border-dashed border-surface-300 dark:border-surface-700">
              <BoardIcon size={48} className="mx-auto text-surface-400 mb-4" />
              <h3 className="text-xl mb-2">No boards yet</h3>
              <p className="text-surface-500 dark:text-surface-400 mb-4">
                Create your first board to get started
              </p>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="btn-primary"
              >
                <PlusIcon size={18} className="mr-2" />
                Create Board
              </button>
            </div>
          )}
        </div>
        
        {/* Main Feature - Kanban Board */}
        <MainFeature />
      </div>
      
      {/* Create Board Modal */}
      <CreateBoardModal />
    </div>
  );
}