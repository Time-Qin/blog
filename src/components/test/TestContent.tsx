import { useState } from 'react';
import zhonyaoxue from '../../assets/json/zhonyaoxue.json';
import fangjixue from '../../assets/json/fangjixue.json';
import binglixue from '../../assets/json/binglixue.json';
import zhongyiwai from '../../assets/json/zhongyiwai.json'
import zhongyinei from '../../assets/json/zhongyinei.json'
import { AUTHOR } from '../../consts';
type Question = {
    id: number;
    type?: string;
    question: string;
    options: {
        A: string;
        B: string;
        C?: string;
        D?: string;
        E?: string;
    };
};

type Answer = {
    id: number | string;
    answer: string | string[];
    question?: string;
    options?: any;
};

interface TestContentProps {
    id: 'example-1' | 'example-2' | 'example-3' | 'example-4' | 'example-5' | string;
}

const TestContent = ({ id }: TestContentProps) => {
    const option: Record<string, {
        title: string,
        question_list: {
            one_choice_questions: Question[], 
            more_choice_questions?: Question[], 
            judge_questions: Question[],
        },
        answer_list: { 
            one_choice_questions: Answer[], 
            more_choice_questions?: Answer[], 
            judge_questions: Answer[], 
        },
    }> = {
        "example-1": binglixue,
        "example-2": fangjixue,
        "example-3": zhonyaoxue,
        "example-4": zhongyiwai,
        "example-5": zhongyinei,
    };

    const data = option[id] || binglixue;
    
    // 将所有题目合并到一个数组中
    const getAllQuestions = () => {
        const questions: { type: string; data: Question }[] = [];
        
        // 添加单选题
        data.question_list.one_choice_questions.forEach(q => {
            questions.push({ type: '单选题', data: q });
        });
        
        // 添加多选题
        if (data.question_list.more_choice_questions) {
            data.question_list.more_choice_questions.forEach(q => {
                questions.push({ type: '多选题', data: q });
            });
        }
        
        // 添加判断题
        data.question_list.judge_questions.forEach(q => {
            questions.push({ type: '判断题', data: q });
        });
        
        return questions;
    };
    
    // 获取答案列表
    const getAnswerList = () => {
        const answers: Record<number, string | string[]> = {};
        
        // 单选题答案
        data.answer_list.one_choice_questions.forEach(a => {
            answers[a.id as number] = a.answer as string;
        });
        
        // 多选题答案
        if (data.answer_list.more_choice_questions) {
            data.answer_list.more_choice_questions.forEach(a => {
                answers[a.id as number] = a.answer as string[];
            });
        }
        
        // 判断题答案
        data.answer_list.judge_questions.forEach(a => {
            answers[a.id as number] = a.answer as string;
        });
        
        return answers;
    };
    
    const allQuestions = getAllQuestions();
    const answerList = getAnswerList();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
    const [showAnswer, setShowAnswer] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    
    const handleSingleChoiceChange = (questionId: number, optionKey: string) => {
        if (submitted) return; // 提交后禁止更改答案
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionKey
        }));
    };
    
    const handleMultipleChoiceChange = (questionId: number, optionKey: string) => {
        if (submitted) return; // 提交后禁止更改答案
        setAnswers(prev => {
            const currentAnswers = Array.isArray(prev[questionId]) ? [...prev[questionId]] as string[] : [];
            const index = currentAnswers.indexOf(optionKey);
            
            if (index >= 0) {
                // 如果选项已选中，则取消选择
                currentAnswers.splice(index, 1);
            } else {
                // 如果选项未选中，则添加到答案中
                currentAnswers.push(optionKey);
            }
            
            // 对答案进行排序，确保一致性
            return {
                ...prev,
                [questionId]: currentAnswers.sort()
            };
        });
    };
    
    const handleJudgeChange = (questionId: number, value: string) => {
        if (submitted) return; // 提交后禁止更改答案
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };
    
    const handleNext = () => {
        if (currentQuestionIndex < allQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            // 注意：这里不再自动隐藏答案，而是保持用户查看答案的状态
        }
    };
    
    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
            // 注意：这里不再自动隐藏答案，而是保持用户查看答案的状态
        }
    };
    
    const toggleShowAnswer = () => {
        setShowAnswer(prev => !prev);
    };
    
    const handleSubmit = () => {
        setSubmitted(true);
        setShowAnswer(true); // 提交后自动显示答案
    };
    
    const handleReset = () => {
        setAnswers({});
        setSubmitted(false);
        setShowAnswer(false);
        setCurrentQuestionIndex(0);
    };

    const handleBackToList = () => {
        window.confirm('是否返回列表？') && history.go(-1);
    };

    const renderOptions = (question: Question, questionType: string) => {
        const optionKeys = Object.keys(question.options) as (keyof Question['options'])[];
        
        return (
            <div className="ml-2 mt-4 space-y-3">
                {optionKeys.map((optionKey) => {
                    const optionValue = question.options[optionKey];
                    if (!optionValue) return null;
                    
                    // 获取当前选项是否为正确答案
                    const correctAnswer = answerList[question.id];
                    const isCorrectOption = Array.isArray(correctAnswer) 
                        ? correctAnswer.includes(optionKey)
                        : correctAnswer === optionKey;
                    
                    // 获取用户选择的答案
                    const userAnswer = answers[question.id];
                    const isSelected = Array.isArray(userAnswer)
                        ? userAnswer.includes(optionKey)
                        : userAnswer === optionKey;
                    
                    let optionClass = "";
                    let feedbackText = "";
                    let feedbackClass = "";
                    
                    // 提交后或者主动查看答案时，都显示答案反馈样式
                    if (showAnswer) {
                        if (isCorrectOption) {
                            optionClass = "border-green-500 bg-green-50 hover:bg-green-100";
                            feedbackText = "✓ 正确答案";
                            feedbackClass = "text-green-600";
                        } else if (isSelected && !isCorrectOption) {
                            optionClass = "border-red-500 bg-red-50 hover:bg-red-100";
                            feedbackText = "✗ 你的选择";
                            feedbackClass = "text-red-600";
                        } else if (isSelected && isCorrectOption) {
                            // 用户选择正确的情况也高亮显示
                            optionClass = "border-green-500 bg-green-50 hover:bg-green-100";
                            feedbackText = "✓ 你的选择";
                            feedbackClass = "text-green-600";
                        }
                    }
                    
                    if (questionType === '多选题') {
                        return (
                            <div 
                                key={optionKey} 
                                className={`flex items-start p-4 border-2 rounded-lg transition-all duration-200 ${optionClass}`}
                            >
                                <input
                                    type="checkbox"
                                    id={`${question.id}-${optionKey}`}
                                    checked={Array.isArray(answers[question.id]) && (answers[question.id] as string[]).includes(optionKey)}
                                    onChange={() => handleMultipleChoiceChange(question.id, optionKey)}
                                    className="mt-1 h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                                    disabled={showAnswer} // 显示答案时禁用选择
                                />
                                <label 
                                    htmlFor={`${question.id}-${optionKey}`} 
                                    className="ml-3 flex-grow cursor-pointer"
                                >
                                    <span className="font-bold text-gray-800">{optionKey}.</span>
                                    <span className="ml-2 text-gray-700">{optionValue}</span>
                                </label>
                                {showAnswer && feedbackText && (
                                    <span className={`ml-2 font-bold whitespace-nowrap ${feedbackClass}`}>
                                        {feedbackText}
                                    </span>
                                )}
                            </div>
                        );
                    } else {
                        return (
                            <div 
                                key={optionKey} 
                                className={`flex items-start p-4 border-2 rounded-lg transition-all duration-200 ${optionClass}`}
                            >
                                <input
                                    type="radio"
                                    id={`${question.id}-${optionKey}`}
                                    name={`question-${question.id}`}
                                    checked={answers[question.id] === optionKey}
                                    onChange={() => handleSingleChoiceChange(question.id, optionKey)}
                                    className="mt-1 h-5 w-5 text-indigo-600"
                                    disabled={showAnswer} // 显示答案时禁用选择
                                />
                                <label 
                                    htmlFor={`${question.id}-${optionKey}`} 
                                    className="ml-3 flex-grow cursor-pointer"
                                >
                                    <span className="font-bold text-gray-800">{optionKey}.</span>
                                    <span className="ml-2 text-gray-700">{optionValue}</span>
                                </label>
                                {showAnswer && feedbackText && (
                                    <span className={`ml-2 font-bold whitespace-nowrap ${feedbackClass}`}>
                                        {feedbackText}
                                    </span>
                                )}
                            </div>
                        );
                    }
                })}
            </div>
        );
    };

    const renderJudgeQuestion = (question: Question) => {
        // 获取正确答案和用户答案
        const correctAnswer = answerList[question.id];
        const userAnswer = answers[question.id];
        
        // 判断选项是否正确或被选中
        const isTrueCorrect = correctAnswer === '正确';
        const isFalseCorrect = correctAnswer === '错误';
        const isTrueSelected = userAnswer === '正确';
        const isFalseSelected = userAnswer === '错误';
        
        return (
            <div className="ml-2 mt-4 space-y-3">
                <div className={`flex items-start p-4 border-2 rounded-lg transition-all duration-200 ${
                    showAnswer && isTrueCorrect 
                        ? "border-green-500 bg-green-50" 
                        : showAnswer && isTrueSelected && !isTrueCorrect
                            ? "border-red-500 bg-red-50"
                            : "hover:bg-gray-50"
                }`}>
                    <input
                        type="radio"
                        id={`${question.id}-true`}
                        name={`judge-${question.id}`}
                        checked={answers[question.id] === '正确'}
                        onChange={() => handleJudgeChange(question.id, '正确')}
                        className="mt-1 h-5 w-5 text-indigo-600"
                        disabled={showAnswer} // 显示答案时禁用选择
                    />
                    <label 
                        htmlFor={`${question.id}-true`} 
                        className="ml-3 flex-grow cursor-pointer"
                    >
                        <span className="font-bold text-gray-800">A.</span>
                        <span className="ml-2 text-gray-700">正确</span>
                    </label>
                    {showAnswer && isTrueCorrect && (
                        <span className="ml-2 font-bold text-green-600 whitespace-nowrap">
                            ✓ 正确答案
                        </span>
                    )}
                    {showAnswer && isTrueSelected && !isTrueCorrect && (
                        <span className="ml-2 font-bold text-red-600 whitespace-nowrap">
                            ✗ 你的选择
                        </span>
                    )}
                    {showAnswer && isTrueSelected && isTrueCorrect && (
                        <span className="ml-2 font-bold text-green-600 whitespace-nowrap">
                            ✓ 你的选择
                        </span>
                    )}
                </div>
                
                <div className={`flex items-start p-4 border-2 rounded-lg transition-all duration-200 ${
                    showAnswer && isFalseCorrect 
                        ? "border-green-500 bg-green-50" 
                        : showAnswer && isFalseSelected && !isFalseCorrect
                            ? "border-red-500 bg-red-50"
                            : "hover:bg-gray-50"
                }`}>
                    <input
                        type="radio"
                        id={`${question.id}-false`}
                        name={`judge-${question.id}`}
                        checked={answers[question.id] === '错误'}
                        onChange={() => handleJudgeChange(question.id, '错误')}
                        className="mt-1 h-5 w-5 text-indigo-600"
                        disabled={showAnswer} // 显示答案时禁用选择
                    />
                    <label 
                        htmlFor={`${question.id}-false`} 
                        className="ml-3 flex-grow cursor-pointer"
                    >
                        <span className="font-bold text-gray-800">B.</span>
                        <span className="ml-2 text-gray-700">错误</span>
                    </label>
                    {showAnswer && isFalseCorrect && (
                        <span className="ml-2 font-bold text-green-600 whitespace-nowrap">
                            ✓ 正确答案
                        </span>
                    )}
                    {showAnswer && isFalseSelected && !isFalseCorrect && (
                        <span className="ml-2 font-bold text-red-600 whitespace-nowrap">
                            ✗ 你的选择
                        </span>
                    )}
                    {showAnswer && isFalseSelected && isFalseCorrect && (
                        <span className="ml-2 font-bold text-green-600 whitespace-nowrap">
                            ✓ 你的选择
                        </span>
                    )}
                </div>
            </div>
        );
    };

    // 计算正确和错误的题目数量
    const calculateResults = () => {
        let correctCount = 0;
        let wrongCount = 0;
        
        Object.keys(answers).forEach(questionIdStr => {
            const questionId = parseInt(questionIdStr);
            const userAnswer = answers[questionId];
            const correctAnswer = answerList[questionId];
            
            if (Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
                // 多选题答案比较
                if (JSON.stringify(userAnswer.sort()) === JSON.stringify(correctAnswer.sort())) {
                    correctCount++;
                } else {
                    wrongCount++;
                }
            } else if (userAnswer === correctAnswer) {
                // 单选题和判断题答案比较
                correctCount++;
            } else {
                wrongCount++;
            }
        });
        
        return { correctCount, wrongCount };
    };

    const currentQuestion = allQuestions[currentQuestionIndex];
    const { correctCount, wrongCount } = calculateResults();
    const unansweredCount = allQuestions.length - Object.keys(answers).length;
    
    return (
        <div className="max-w-4xl mx-auto ">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* 头部标题区域 */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
                    <h2 className="text-2xl md:text-3xl font-bold">{data.title}</h2>
                    <p className="mt-2 opacity-90">认真作答，祝你取得好成绩！<strong>——开发人员：</strong>{AUTHOR}</p>
                </div>
                
                {/* 题目进度信息 */}
                <div className="py-3 text-center bg-gray-50">
                    <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow">
                        <span className="text-lg font-semibold text-gray-700">
                            第 {currentQuestionIndex + 1} 题
                        </span>
                        <span className="mx-2 text-gray-400">/</span>
                        <span className="text-lg font-semibold text-gray-700">
                            共 {allQuestions.length} 题
                        </span>
                    </div>
                    <p className="mt-2 mb-0 text-gray-600">
                        题型: <span className="font-medium">{currentQuestion.type}</span>
                    </p>
                </div>
                
                {/* 题目内容 */}
                <div className="p-6">
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                        <p className="text-lg md:text-xl font-medium text-gray-800 mb-0">
                            {currentQuestion.data.id}. {currentQuestion.data.question}
                        </p>
                    </div>
                    
                    {/* 根据题型渲染选项 */}
                    <div className="mt-6">
                        {currentQuestion.type === '判断题' ? (
                            renderJudgeQuestion(currentQuestion.data)
                        ) : (
                            renderOptions(currentQuestion.data, currentQuestion.type)
                        )}
                    </div>
                </div>
                
                {/* 操作按钮区域 */}
                <div className="px-6 py-4 bg-gray-50 flex flex-wrap justify-center gap-3">
                    {!submitted ? (
                        <>
                            <button
                                onClick={toggleShowAnswer}
                                className="px-5 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg shadow transition duration-300 ease-in-out transform hover:-translate-y-0.5"
                            >
                                {showAnswer ? '隐藏答案' : '查看答案'}
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow transition duration-300 ease-in-out transform hover:-translate-y-0.5"
                            >
                                提交作答
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleReset}
                            className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow transition duration-300 ease-in-out transform hover:-translate-y-0.5"
                        >
                            重新开始
                        </button>
                    )}
                    <button
                        onClick={handleBackToList}
                        className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg shadow transition duration-300 ease-in-out transform hover:-translate-y-0.5"
                    >
                        返回试题列表
                    </button>
                </div>
                
                {/* 导航按钮 */}
                <div className="flex justify-between px-6 py-4 border-t border-gray-200">
                    <button
                        onClick={handlePrev}
                        disabled={currentQuestionIndex === 0}
                        className={`px-5 py-2 rounded-lg shadow transition duration-300 ease-in-out transform hover:-translate-y-0.5 ${
                            currentQuestionIndex === 0 
                                ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                                : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                        }`}
                    >
                        上一题
                    </button>
                    
                    <button
                        onClick={handleNext}
                        disabled={currentQuestionIndex === allQuestions.length - 1}
                        className={`px-5 py-2 rounded-lg shadow transition duration-300 ease-in-out transform hover:-translate-y-0.5 ${
                            currentQuestionIndex === allQuestions.length - 1 
                                ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                                : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                        }`}
                    >
                        下一题
                    </button>
                </div>
                
                {/* 答题统计 */}
                <div className="m-6 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">答题统计</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                            <p className="text-gray-700 mb-0">
                                已答: <span className="font-bold">{Object.keys(answers).length}</span> 题
                            </p>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                            <p className="text-gray-700 mb-0">
                                未答: <span className="font-bold">{unansweredCount}</span> 题
                            </p>
                        </div>
                        {submitted && (
                            <>
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                    <p className="text-gray-700">
                                        正确: <span className="font-bold text-green-600">{correctCount}</span> 题
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                    <p className="text-gray-700">
                                        错误: <span className="font-bold text-red-600">{wrongCount}</span> 题
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                    {submitted && (
                        <div className="mt-4 pt-4 border-t border-blue-100">
                            <p className="text-lg">
                                正确率: 
                                <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                                    {Math.round((correctCount / allQuestions.length) * 100)}%
                                </span>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TestContent;