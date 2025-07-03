'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface RankingData {
    rank: number;
    userId: number;
    userName: string;
    kuuCount: number;
    level: number;
    title: string;
    titleLevel: number;
}

interface PaginationData {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
}

interface RankingResponse {
    rankings: RankingData[];
    pagination: PaginationData;
}

export default function RankingPage() {
    const [rankingData, setRankingData] = useState<RankingData[]>([]);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'card' | 'list'>('card');

    const fetchRanking = async (page: number = 1) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/kuu/ranking?page=${page}&limit=10`);
            if (!response.ok) {
                throw new Error('ランキングの取得に失敗しました');
            }
            const data: RankingResponse = await response.json();
            setRankingData(data.rankings);
            setPagination(data.pagination);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'エラーが発生しました');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRanking(currentPage);
    }, [currentPage]);

    // 5秒ごとにランキングを更新
    useEffect(() => {
        const interval = setInterval(() => {
            fetchRanking(currentPage);
        }, 5000);

        return () => clearInterval(interval);
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const getRankColor = (rank: number) => {
        if (rank === 1) return 'text-yellow-500';
        if (rank === 2) return 'text-gray-400';
        if (rank === 3) return 'text-amber-600';
        return 'text-gray-600';
    };

    const getRankIcon = (rank: number) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `${rank}`;
    };

    const getRankBadge = (rank: number) => {
        if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
        if (rank === 2) return 'bg-gradient-to-r from-gray-400 to-gray-600';
        if (rank === 3) return 'bg-gradient-to-r from-amber-600 to-amber-800';
        return 'bg-gradient-to-r from-orange-500 to-rose-400';
    };

    if (loading && rankingData.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-6"></div>
                            <p className="text-lg text-gray-600 font-medium">ランキングを読み込み中...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                {/* ヘッダーセクション */}
                <div className="text-center mb-8 sm:mb-12">
                    <div className="mb-4 sm:mb-6">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-orange-900 mb-2 sm:mb-4">
                            くぅーランキング
                        </h1>
                        <p className="text-sm sm:text-base lg:text-lg text-orange-800 max-w-2xl mx-auto leading-relaxed">
                            みんなのくぅー愛をランキングで確認しよう！
                            <span className="block text-xs sm:text-sm text-orange-600 mt-1 sm:mt-2">
                                ⏰ 5秒ごとに自動更新されます
                            </span>
                        </p>
                    </div>
                    
                    <div className="flex justify-center">
                        <Link 
                            href="/" 
                            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-white text-orange-700 rounded-full hover:bg-orange-50 transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105 font-semibold text-sm sm:text-base"
                        >
                            <span className="mr-2">←</span>
                            ホームに戻る
                        </Link>
                    </div>
                </div>

                {/* ビュー切り替え */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex justify-center">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm sm:text-base font-medium text-gray-700">表示:</span>
                            <div className="flex bg-white rounded-lg shadow-md p-1">
                                <button
                                    onClick={() => setViewMode('card')}
                                    className={`px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-all ${
                                        viewMode === 'card'
                                            ? 'bg-orange-500 text-white'
                                            : 'text-gray-600 hover:text-orange-600'
                                    }`}
                                >
                                    カード
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-all ${
                                        viewMode === 'list'
                                            ? 'bg-orange-500 text-white'
                                            : 'text-gray-600 hover:text-orange-600'
                                    }`}
                                >
                                    リスト
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* エラーメッセージ */}
                {error && (
                    <div className="max-w-2xl mx-auto mb-6 sm:mb-8">
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 sm:p-6 rounded-lg shadow-md">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ランキングカードセクション */}
                <div className="mb-8 sm:mb-12">
                    {viewMode === 'card' ? (
                        <>
                            {/* モバイル用：横スクロールカード */}
                            <div className="block lg:hidden">
                                <div className="overflow-x-auto pb-4 -mx-4 px-4">
                                    <div className="flex space-x-4 min-w-max">
                                        {rankingData.map((item) => (
                                            <div
                                                key={item.userId}
                                                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-orange-100 w-64 flex-shrink-0"
                                            >
                                                {/* ランキングバッジ */}
                                                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20">
                                                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-lg font-bold shadow-lg ${getRankColor(item.rank)}`}>
                                                        {getRankIcon(item.rank)}
                                                    </div>
                                                </div>

                                                {/* カードコンテンツ */}
                                                <div className="p-4 sm:p-6 pt-6 sm:pt-8 relative z-10">
                                                    <div className="text-center space-y-3 sm:space-y-4">
                                                        {/* ユーザー名 */}
                                                        <h3 className="font-bold text-gray-800 text-base sm:text-lg truncate group-hover:text-orange-600 transition-colors duration-300">
                                                            {item.userName}
                                                        </h3>
                                                        
                                                        {/* くぅー数 */}
                                                        <div className="space-y-1 sm:space-y-2">
                                                            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-600">
                                                                {item.kuuCount.toLocaleString()}
                                                            </div>
                                                            <div className="text-xs sm:text-sm text-gray-500 font-medium">くぅー</div>
                                                        </div>
                                                        
                                                        {/* レベルと称号 */}
                                                        <div className="space-y-2 sm:space-y-3">
                                                            <div className="inline-block bg-orange-100 text-orange-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                                                                Lv.{item.level}
                                                            </div>
                                                            <div className="bg-gradient-to-r from-orange-500 to-rose-400 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium shadow-md">
                                                                {item.title}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* ホバー時の装飾 */}
                                                <div className="absolute inset-0 bg-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* スクロールインジケーター */}
                                <div className="text-center mt-4">
                                    <p className="text-xs sm:text-sm text-gray-500">
                                        ← 左右にスワイプしてランキングを見る →
                                    </p>
                                </div>
                            </div>

                            {/* デスクトップ用：グリッド表示 */}
                            <div className="hidden lg:grid lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
                                {rankingData.map((item) => (
                                    <div
                                        key={item.userId}
                                        className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-orange-100"
                                    >
                                        {/* ランキングバッジ */}
                                        <div className="absolute top-4 right-4 z-20">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-lg ${getRankColor(item.rank)}`}>
                                                {getRankIcon(item.rank)}
                                            </div>
                                        </div>

                                        {/* カードコンテンツ */}
                                        <div className="p-6 pt-8 relative z-10">
                                            <div className="text-center space-y-4">
                                                {/* ユーザー名 */}
                                                <h3 className="font-bold text-gray-800 text-lg truncate group-hover:text-orange-600 transition-colors duration-300">
                                                    {item.userName}
                                                </h3>
                                                
                                                {/* くぅー数 */}
                                                <div className="space-y-2">
                                                    <div className="text-4xl font-bold text-orange-600">
                                                        {item.kuuCount.toLocaleString()}
                                                    </div>
                                                    <div className="text-sm text-gray-500 font-medium">くぅー</div>
                                                </div>
                                                
                                                {/* レベルと称号 */}
                                                <div className="space-y-3">
                                                    <div className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                                                        Lv.{item.level}
                                                    </div>
                                                    <div className="bg-gradient-to-r from-orange-500 to-rose-400 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md">
                                                        {item.title}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ホバー時の装飾 */}
                                        <div className="absolute inset-0 bg-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"></div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        /* リスト表示 */
                        <>
                            {/* モバイル用：カード形式のリスト */}
                            <div className="block lg:hidden">
                                <div className="space-y-3">
                                    {rankingData.map((item) => (
                                        <div
                                            key={item.userId}
                                            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-orange-100 overflow-hidden"
                                        >
                                            {/* ランキングヘッダー */}
                                            <div className="bg-gradient-to-r from-orange-500 to-rose-400 text-white px-4 py-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <span className={`text-lg font-bold ${getRankColor(item.rank)}`}>
                                                            {getRankIcon(item.rank)}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs opacity-90">
                                                        Lv.{item.level}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* ユーザー情報 */}
                                            <div className="p-4 space-y-3">
                                                <div className="text-center">
                                                    <h3 className="font-bold text-gray-800 text-lg mb-1">
                                                        {item.userName}
                                                    </h3>
                                                    <div className="bg-gradient-to-r from-orange-500 to-rose-400 text-white px-3 py-1 rounded-lg text-sm font-medium inline-block">
                                                        {item.title}
                                                    </div>
                                                </div>
                                                
                                                {/* くぅー数 */}
                                                <div className="text-center bg-orange-50 rounded-lg py-3">
                                                    <div className="text-2xl font-bold text-orange-600">
                                                        {item.kuuCount.toLocaleString()}
                                                    </div>
                                                    <div className="text-xs text-gray-500 font-medium">
                                                        くぅー
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* デスクトップ用：テーブル表示 */}
                            <div className="hidden lg:block">
                                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gradient-to-r from-orange-500 to-rose-400 text-white">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-base font-semibold">順位</th>
                                                    <th className="px-4 py-3 text-left text-base font-semibold">ユーザー名</th>
                                                    <th className="px-4 py-3 text-left text-base font-semibold">くぅー数</th>
                                                    <th className="px-4 py-3 text-left text-base font-semibold">レベル</th>
                                                    <th className="px-4 py-3 text-left text-base font-semibold">称号</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {rankingData.map((item, index) => (
                                                    <tr key={item.userId} className="hover:bg-orange-50 transition-colors">
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center space-x-2">
                                                                <span className={`text-xl font-bold ${getRankColor(item.rank)}`}>
                                                                    {getRankIcon(item.rank)}
                                                                </span>
                                                                <span className="text-base font-medium text-gray-600">
                                                                    {item.rank}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className="text-base font-medium text-gray-800">
                                                                {item.userName}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className="text-base font-bold text-orange-600">
                                                                {item.kuuCount.toLocaleString()}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className="inline-block bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-sm font-semibold">
                                                                Lv.{item.level}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className="inline-block bg-gradient-to-r from-orange-500 to-rose-400 text-white px-3 py-1 rounded-lg text-sm font-medium">
                                                                {item.title}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* ページングセクション */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="mb-6 sm:mb-8">
                        <div className="flex flex-col items-center space-y-4 sm:space-y-6">
                            {/* ページングナビゲーション */}
                            <div className="flex items-center space-x-1 sm:space-x-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 sm:px-4 py-2 bg-white text-orange-700 rounded-lg disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-orange-50 transition-all duration-300 shadow-md hover:shadow-lg font-semibold text-sm sm:text-base"
                                >
                                    前へ
                                </button>
                                
                                <div className="flex items-center space-x-1">
                                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                        const pageNum = Math.max(1, Math.min(pagination.totalPages - 4, currentPage - 2)) + i;
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg transition-all duration-300 font-semibold text-sm sm:text-base ${
                                                    currentPage === pageNum
                                                        ? 'bg-gradient-to-r from-orange-500 to-rose-400 text-white shadow-lg'
                                                        : 'bg-white text-orange-700 hover:bg-orange-50 shadow-md hover:shadow-lg'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>
                                
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === pagination.totalPages}
                                    className="px-3 sm:px-4 py-2 bg-white text-orange-700 rounded-lg disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-orange-50 transition-all duration-300 shadow-md hover:shadow-lg font-semibold text-sm sm:text-base"
                                >
                                    次へ
                                </button>
                            </div>

                            {/* ページ情報 */}
                            <div className="text-center">
                                <p className="text-gray-600 font-medium text-sm sm:text-base">
                                    <span className="text-orange-600 font-bold">{pagination.totalCount}</span>人中 
                                    <span className="text-orange-600 font-bold mx-2">
                                        {(currentPage - 1) * pagination.limit + 1}-{Math.min(currentPage * pagination.limit, pagination.totalCount)}
                                    </span>位を表示
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                    ページ {currentPage} / {pagination.totalPages}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* フッター */}
                <div className="text-center pt-6 sm:pt-8 border-t border-orange-200">
                    <p className="text-gray-500 text-xs sm:text-sm">
                        くぅーランキング - みんなの癒やしを数値化
                    </p>
                </div>
            </div>
        </div>
    );
} 