import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X } from 'lucide-react';

export default function FlyingWheelPlanner() {
  // 获取东8区明天的日期
  const getTomorrowDate = () => {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const chinaTime = new Date(utc + (3600000 * 8));
    chinaTime.setDate(chinaTime.getDate() + 1);
    return chinaTime.toISOString().split('T')[0];
  };

  const [deadline, setDeadline] = useState(getTomorrowDate());
  const [coreGoals, setCoreGoals] = useState(['核心计划1', '核心计划2', '核心计划3']);
  const [sectors, setSectors] = useState([
    { name: '身体', innerTasks: ['健身'], outerTasks: ['运动', '健康饮食'], innerCompleted: [true], outerCompleted: [true, false] },
    { name: '心智', innerTasks: ['深度学习'], outerTasks: ['阅读', '学习'], innerCompleted: [false], outerCompleted: [true, true] },
    { name: '灵魂', innerTasks: ['冥想'], outerTasks: ['反思'], innerCompleted: [true], outerCompleted: [false] },
    { name: '使命', innerTasks: ['事业规划'], outerTasks: ['项目推进'], innerCompleted: [true], outerCompleted: [true] },
    { name: '金钱', innerTasks: ['投资'], outerTasks: ['理财', '储蓄'], innerCompleted: [false], outerCompleted: [false, false] },
    { name: '成长', innerTasks: ['学新技能'], outerTasks: ['课程学习'], innerCompleted: [true], outerCompleted: [true] },
    { name: '朋友', innerTasks: ['深度交流'], outerTasks: ['社交活动'], innerCompleted: [false], outerCompleted: [false] },
    { name: '家庭', innerTasks: ['陪伴父母'], outerTasks: ['家庭聚餐'], innerCompleted: [true], outerCompleted: [true] },
    { name: '爱人', innerTasks: ['深度约会'], outerTasks: ['日常陪伴'], innerCompleted: [false], outerCompleted: [false] },
  ]);
  const [editMode, setEditMode] = useState(false);
  const [selectedSector, setSelectedSector] = useState(null);
  const [hoveredArea, setHoveredArea] = useState(null);
  const [visibleSectors, setVisibleSectors] = useState(new Set(sectors.map((_, i) => i)));
  const [editingSector, setEditingSector] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  const addSector = () => {
    const newIndex = sectors.length;
    setSectors([...sectors, { name: '新领域', innerTasks: ['重要任务'], outerTasks: ['普通任务'], innerCompleted: [false], outerCompleted: [false] }]);
    setVisibleSectors(new Set([...visibleSectors, newIndex]));
  };

  const removeSector = (index) => {
    setSectors(sectors.filter((_, i) => i !== index));
    setSelectedSector(null);
    const newVisible = new Set(visibleSectors);
    newVisible.delete(index);
    setVisibleSectors(newVisible);
  };

  const updateCoreGoal = (index, value) => {
    const newGoals = [...coreGoals];
    newGoals[index] = value;
    setCoreGoals(newGoals);
  };

  const addCoreGoal = () => {
    if (coreGoals.length < 5) {
      setCoreGoals([...coreGoals, '新核心计划']);
    }
  };

  const removeCoreGoal = (index) => {
    setCoreGoals(coreGoals.filter((_, i) => i !== index));
  };

  const updateSectorName = (index, name) => {
    const newSectors = [...sectors];
    newSectors[index].name = name;
    setSectors(newSectors);
  };

  const addTask = (sectorIndex, isInner) => {
    const newSectors = [...sectors];
    if (isInner) {
      newSectors[sectorIndex].innerTasks.push('新重要任务');
      newSectors[sectorIndex].innerCompleted.push(false);
    } else {
      newSectors[sectorIndex].outerTasks.push('新任务');
      newSectors[sectorIndex].outerCompleted.push(false);
    }
    setSectors(newSectors);
  };

  const updateTask = (sectorIndex, taskIndex, value, isInner) => {
    const newSectors = [...sectors];
    if (isInner) {
      newSectors[sectorIndex].innerTasks[taskIndex] = value;
    } else {
      newSectors[sectorIndex].outerTasks[taskIndex] = value;
    }
    setSectors(newSectors);
  };

  const toggleTask = (sectorIndex, taskIndex, isInner) => {
    const newSectors = [...sectors];
    if (isInner) {
      newSectors[sectorIndex].innerCompleted[taskIndex] = !newSectors[sectorIndex].innerCompleted[taskIndex];
    } else {
      newSectors[sectorIndex].outerCompleted[taskIndex] = !newSectors[sectorIndex].outerCompleted[taskIndex];
    }
    setSectors(newSectors);
  };

  const removeTask = (sectorIndex, taskIndex, isInner) => {
    const newSectors = [...sectors];
    if (isInner) {
      newSectors[sectorIndex].innerTasks = newSectors[sectorIndex].innerTasks.filter((_, i) => i !== taskIndex);
      newSectors[sectorIndex].innerCompleted = newSectors[sectorIndex].innerCompleted.filter((_, i) => i !== taskIndex);
    } else {
      newSectors[sectorIndex].outerTasks = newSectors[sectorIndex].outerTasks.filter((_, i) => i !== taskIndex);
      newSectors[sectorIndex].outerCompleted = newSectors[sectorIndex].outerCompleted.filter((_, i) => i !== taskIndex);
    }
    setSectors(newSectors);
  };

  const toggleSectorVisibility = (index) => {
    const newVisible = new Set(visibleSectors);
    if (newVisible.has(index)) {
      newVisible.delete(index);
    } else {
      newVisible.add(index);
    }
    setVisibleSectors(newVisible);
  };

  const getCompletionRate = (sector, isInner) => {
    const tasks = isInner ? sector.innerTasks : sector.outerTasks;
    const completed = isInner ? sector.innerCompleted : sector.outerCompleted;
    if (tasks.length === 0) return 0;
    const completedCount = completed.filter(c => c).length;
    return (completedCount / tasks.length) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 标题区 */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'cursive' }}>
            飞轮计划法
          </h1>
          <div className="flex items-center justify-center gap-4 mb-4">
            <label className="text-lg font-semibold text-gray-700">目标日期：</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="px-4 py-2 border-2 border-orange-300 rounded-lg focus:outline-none focus:border-orange-500"
            />
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            {editMode ? '完成编辑' : '进入编辑模式'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：可视化飞轮 */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">飞轮视图</h2>
            <p className="text-sm text-center text-gray-600 mb-4">双击区域显示/隐藏任务文字 | 单击区域编辑任务</p>
            <div className="relative w-full" style={{ paddingBottom: '100%' }}>
              <svg viewBox="0 0 500 500" className="absolute inset-0 w-full h-full">
                {/* 外圈扇形 */}
                {sectors.map((sector, index) => {
                  const angle = (360 / sectors.length);
                  const startAngle = index * angle - 90;
                  const endAngle = startAngle + angle;
                  const outerCompletionRate = getCompletionRate(sector, false);
                  
                  const outerRadius = 220;
                  const innerRadius = 120;
                  
                  const startRad = (startAngle * Math.PI) / 180;
                  const endRad = (endAngle * Math.PI) / 180;
                  
                  const x1 = 250 + innerRadius * Math.cos(startRad);
                  const y1 = 250 + innerRadius * Math.sin(startRad);
                  const x2 = 250 + outerRadius * Math.cos(startRad);
                  const y2 = 250 + outerRadius * Math.sin(startRad);
                  const x3 = 250 + outerRadius * Math.cos(endRad);
                  const y3 = 250 + outerRadius * Math.sin(endRad);
                  const x4 = 250 + innerRadius * Math.cos(endRad);
                  const y4 = 250 + innerRadius * Math.sin(endRad);
                  
                  const largeArc = angle > 180 ? 1 : 0;
                  
                  const outerPath = `M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x1} ${y1}`;
                  
                  // 领域名称位置
                  const nameAngle = (startAngle + endAngle) / 2;
                  const nameRad = (nameAngle * Math.PI) / 180;
                  const nameRadius = 170;
                  const nameX = 250 + nameRadius * Math.cos(nameRad);
                  const nameY = 250 + nameRadius * Math.sin(nameRad);
                  
                  const isHovered = hoveredArea === `outer-${index}`;
                  const isSelected = selectedSector === index;
                  
                  return (
                    <g key={index}>
                      <path
                        d={outerPath}
                        fill={outerCompletionRate > 50 ? '#60a5fa' : '#dbeafe'}
                        stroke="#1e40af"
                        strokeWidth={isHovered || isSelected ? '3' : '2'}
                        opacity={0.3 + (outerCompletionRate / 100) * 0.7}
                        onMouseEnter={() => setHoveredArea(`outer-${index}`)}
                        onMouseLeave={() => setHoveredArea(null)}
                        onClick={() => setSelectedSector(selectedSector === index ? null : index)}
                        onDoubleClick={() => toggleSectorVisibility(index)}
                        className="cursor-pointer transition-all"
                      />
                      
                      {/* 领域名称 */}
                      <text
                        x={nameX}
                        y={nameY}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-sm font-bold fill-gray-800 pointer-events-none"
                      >
                        {sector.name}
                      </text>

                      {/* 外圈任务文字 */}
                      {visibleSectors.has(index) && sector.outerTasks.map((task, taskIndex) => {
                        const taskAngleOffset = ((taskIndex + 1) / (sector.outerTasks.length + 1)) * angle;
                        const taskAngle = startAngle + taskAngleOffset;
                        const taskRad = (taskAngle * Math.PI) / 180;
                        
                        const taskRadius = 170;
                        const taskX = 250 + taskRadius * Math.cos(taskRad);
                        const taskY = 250 + taskRadius * Math.sin(taskRad) + 15;
                        
                        const isCompleted = sector.outerCompleted[taskIndex];
                        const isEditing = editingTask?.sectorIndex === index && editingTask?.taskIndex === taskIndex && editingTask?.isInner === false;
                        
                        return (
                          <g key={`outer-task-${taskIndex}`}>
                            {isEditing ? (
                              <foreignObject x={taskX - 40} y={taskY - 10} width="80" height="20">
                                <input
                                  type="text"
                                  value={task}
                                  onChange={(e) => updateTask(index, taskIndex, e.target.value, false)}
                                  onBlur={() => setEditingTask(null)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') setEditingTask(null);
                                  }}
                                  autoFocus
                                  className="w-full text-[8px] px-1 py-0 border border-blue-400 rounded"
                                  style={{ fontSize: '8px' }}
                                />
                              </foreignObject>
                            ) : (
                              <text
                                x={taskX}
                                y={taskY}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className={`text-[8px] ${isCompleted ? 'fill-green-600 font-semibold' : 'fill-blue-600'} cursor-pointer`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (editMode) {
                                    setEditingTask({ sectorIndex: index, taskIndex, isInner: false });
                                  }
                                }}
                              >
                                {task.length > 6 ? task.substring(0, 6) + '...' : task}
                              </text>
                            )}
                          </g>
                        );
                      })}
                    </g>
                  );
                })}
                
                {/* 内圈扇形（蛋糕形状，从中心点开始） */}
                {sectors.map((sector, index) => {
                  const angle = (360 / sectors.length);
                  const startAngle = index * angle - 90;
                  const endAngle = startAngle + angle;
                  const innerCompletionRate = getCompletionRate(sector, true);
                  
                  const innerRadius = 120;
                  
                  const startRad = (startAngle * Math.PI) / 180;
                  const endRad = (endAngle * Math.PI) / 180;
                  
                  const x1 = 250;
                  const y1 = 250;
                  const x2 = 250 + innerRadius * Math.cos(startRad);
                  const y2 = 250 + innerRadius * Math.sin(startRad);
                  const x3 = 250 + innerRadius * Math.cos(endRad);
                  const y3 = 250 + innerRadius * Math.sin(endRad);
                  
                  const largeArc = angle > 180 ? 1 : 0;
                  
                  const innerPath = `M ${x1} ${y1} L ${x2} ${y2} A ${innerRadius} ${innerRadius} 0 ${largeArc} 1 ${x3} ${y3} Z`;
                  
                  const isHovered = hoveredArea === `inner-${index}`;
                  const isSelected = selectedSector === index;
                  
                  return (
                    <g key={`inner-${index}`}>
                      <path
                        d={innerPath}
                        fill={innerCompletionRate > 50 ? '#f59e0b' : '#fef3c7'}
                        stroke="#f59e0b"
                        strokeWidth={isHovered || isSelected ? '3' : '2'}
                        opacity={0.4 + (innerCompletionRate / 100) * 0.6}
                        onMouseEnter={() => setHoveredArea(`inner-${index}`)}
                        onMouseLeave={() => setHoveredArea(null)}
                        onClick={() => setSelectedSector(selectedSector === index ? null : index)}
                        onDoubleClick={() => toggleSectorVisibility(index)}
                        className="cursor-pointer transition-all"
                      />

                      {/* 内圈任务文字 */}
                      {visibleSectors.has(index) && sector.innerTasks.map((task, taskIndex) => {
                        const taskAngleOffset = ((taskIndex + 1) / (sector.innerTasks.length + 1)) * angle;
                        const taskAngle = startAngle + taskAngleOffset;
                        const taskRad = (taskAngle * Math.PI) / 180;
                        
                        const taskRadius = 60;
                        const taskX = 250 + taskRadius * Math.cos(taskRad);
                        const taskY = 250 + taskRadius * Math.sin(taskRad);
                        
                        const isCompleted = sector.innerCompleted[taskIndex];
                        const isEditing = editingTask?.sectorIndex === index && editingTask?.taskIndex === taskIndex && editingTask?.isInner === true;
                        
                        return (
                          <g key={`inner-task-${taskIndex}`}>
                            {isEditing ? (
                              <foreignObject x={taskX - 35} y={taskY - 10} width="70" height="20">
                                <input
                                  type="text"
                                  value={task}
                                  onChange={(e) => updateTask(index, taskIndex, e.target.value, true)}
                                  onBlur={() => setEditingTask(null)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') setEditingTask(null);
                                  }}
                                  autoFocus
                                  className="w-full text-[8px] px-1 py-0 border border-orange-400 rounded"
                                  style={{ fontSize: '8px' }}
                                />
                              </foreignObject>
                            ) : (
                              <text
                                x={taskX}
                                y={taskY}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className={`text-[9px] ${isCompleted ? 'fill-green-600 font-bold' : 'fill-orange-700 font-semibold'} cursor-pointer`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (editMode) {
                                    setEditingTask({ sectorIndex: index, taskIndex, isInner: true });
                                  }
                                }}
                              >
                                {task.length > 5 ? task.substring(0, 5) + '...' : task}
                              </text>
                            )}
                          </g>
                        );
                      })}
                    </g>
                  );
                })}
                
                {/* 中心标注 */}
                <circle cx="250" cy="250" r="5" fill="#f59e0b" />
              </svg>
            </div>
            <div className="mt-4 text-center text-sm text-gray-600">
              <div className="flex justify-center gap-6">
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 bg-blue-300 rounded"></span> 外圈：普通任务
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 bg-orange-300 rounded"></span> 内圈：重要任务
                </span>
              </div>
            </div>
          </div>

          {/* 右侧：详细任务显示/编辑区 */}
          <div className="space-y-6">
            {/* 核心计划编辑 */}
            <div className="bg-yellow-100 rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">核心计划（建议3-5个）</h2>
                {editMode && coreGoals.length < 5 && (
                  <button onClick={addCoreGoal} className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                    <Plus size={20} />
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {coreGoals.map((goal, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-600 w-6">{index + 1}.</span>
                    <input
                      type="text"
                      value={goal}
                      onChange={(e) => updateCoreGoal(index, e.target.value)}
                      disabled={!editMode}
                      className="flex-1 px-3 py-2 border-2 border-yellow-300 rounded-lg focus:outline-none focus:border-yellow-500 disabled:bg-yellow-50"
                    />
                    {editMode && (
                      <button onClick={() => removeCoreGoal(index)} className="p-2 text-red-500 hover:bg-red-50 rounded">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-3">💡 核心计划是最重要的少数目标，专注于这些将带来最大的成果</p>
            </div>

            {/* 选中领域的任务详情 */}
            {selectedSector !== null ? (
              <div className="bg-white rounded-2xl shadow-lg p-6 max-h-[600px] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">{sectors[selectedSector].name}</h2>
                  <button 
                    onClick={() => setSelectedSector(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* 内圈重要任务 */}
                <div className="mb-6 p-4 bg-orange-50 rounded-lg border-2 border-orange-300">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-orange-700 flex items-center gap-2">
                      ⭐ 重要任务（内圈）
                      <span className="text-sm font-normal">
                        {getCompletionRate(sectors[selectedSector], true).toFixed(0)}%
                      </span>
                    </h3>
                    {editMode && (
                      <button 
                        onClick={() => addTask(selectedSector, true)} 
                        className="p-1 bg-orange-500 text-white rounded hover:bg-orange-600"
                      >
                        <Plus size={16} />
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {sectors[selectedSector].innerTasks.map((task, tIndex) => (
                      <div key={tIndex} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={sectors[selectedSector].innerCompleted[tIndex]}
                          onChange={() => toggleTask(selectedSector, tIndex, true)}
                          className="w-4 h-4 text-orange-500"
                        />
                        <input
                          type="text"
                          value={task}
                          onChange={(e) => updateTask(selectedSector, tIndex, e.target.value, true)}
                          disabled={!editMode}
                          className={`flex-1 px-2 py-1 border rounded text-sm ${
                            sectors[selectedSector].innerCompleted[tIndex] ? 'line-through text-gray-500' : ''
                          } disabled:border-transparent disabled:bg-orange-50 focus:outline-none focus:border-orange-400`}
                        />
                        {editMode && (
                          <button 
                            onClick={() => removeTask(selectedSector, tIndex, true)} 
                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 外圈普通任务 */}
                <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-blue-700 flex items-center gap-2">
                      📋 普通任务（外圈）
                      <span className="text-sm font-normal">
                        {getCompletionRate(sectors[selectedSector], false).toFixed(0)}%
                      </span>
                    </h3>
                    {editMode && (
                      <button 
                        onClick={() => addTask(selectedSector, false)} 
                        className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        <Plus size={16} />
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {sectors[selectedSector].outerTasks.map((task, tIndex) => (
                      <div key={tIndex} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={sectors[selectedSector].outerCompleted[tIndex]}
                          onChange={() => toggleTask(selectedSector, tIndex, false)}
                          className="w-4 h-4 text-blue-500"
                        />
                        <input
                          type="text"
                          value={task}
                          onChange={(e) => updateTask(selectedSector, tIndex, e.target.value, false)}
                          disabled={!editMode}
                          className={`flex-1 px-2 py-1 border rounded text-sm ${
                            sectors[selectedSector].outerCompleted[tIndex] ? 'line-through text-gray-500' : ''
                          } disabled:border-transparent disabled:bg-blue-50 focus:outline-none focus:border-blue-400`}
                        />
                        {editMode && (
                          <button 
                            onClick={() => removeTask(selectedSector, tIndex, false)} 
                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {editMode && (
                  <div className="mt-4 pt-4 border-t">
                    <button
                      onClick={() => removeSector(selectedSector)}
                      className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      删除此领域
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center min-h-[400px]">
                <div className="text-gray-400 text-center">
                  <div className="text-6xl mb-4">👆</div>
                  <p className="text-lg font-semibold mb-2">单击区域编辑任务</p>
                  <p className="text-sm">双击区域显示/隐藏任务文字</p>
                </div>
                
                {editMode && (
                  <button
                    onClick={addSector}
                    className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
                  >
                    <Plus size={20} />
                    添加新领域
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 底部提示 */}
        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">💡 提示：双击任意区域显示/隐藏任务文字，单击区域编辑任务详情，在编辑模式下点击任务文字可直接修改</p>
        </div>
      </div>
    </div>
  );
}