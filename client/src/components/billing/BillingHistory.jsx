import React, { useState } from 'react';
import moment from 'moment';
import { Info, AlertTriangle, XCircle, ChevronLeft, ChevronRight, Download, Eye, Minimize, Square, X } from 'lucide-react';
 
const BillingHistory = ({ history }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;
 
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };
 
  // Pagination logic
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentHistory = history ? history.slice(indexOfFirstLog, indexOfLastLog) : [];
  const totalPages = history ? Math.ceil(history.length / logsPerPage) : 0;
 
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
 
  const renderContent = () => {
    if (!history || history.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500 bg-gray-50 rounded-lg h-full">
          <div className="p-4 bg-gray-200 rounded-full mb-4">
            <Info className="h-10 w-10 text-gray-500" />
          </div>
          <p className="text-xl font-semibold">No Billing History Found</p>
          <p className="mt-2 text-sm text-gray-400">Your past invoices and transactions will appear here.</p>
        </div>
      );
    }
 
    return (
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Transaction History</h3>
            <button className="flex items-center px-4 py-2 text-sm font-semibold rounded-lg text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
          <div className="overflow-x-auto -mx-6 sm:-mx-8">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-tl-lg">Invoice ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{item.invoiceId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{moment(item.date).format('MMMM D, YYYY')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{item.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href="#" className="text-indigo-600 hover:text-indigo-900 transition-colors">
                        <Eye className="h-5 w-5" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {history.length > logsPerPage && (
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <span className="text-sm font-medium text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };
 
  return (
    <div className="flex flex-col h-full bg-gray-100 rounded-md border border-gray-300 overflow-hidden font-sans">
      {/* Window Title Bar */}
      <div className="bg-gray-200 border-b border-gray-300 p-2 flex items-center justify-between flex-shrink-0">
        
        <span className="text-sm font-medium text-gray-700">Billing History</span>
        <div className="flex items-center space-x-2 opacity-0">
          <Minimize className="w-4 h-4 text-gray-500" />
          <Square className="w-4 h-4 text-gray-500" />
          <X className="w-4 h-4 text-gray-500" />
        </div>
      </div>
      {/* Main Content Area */}
      {renderContent()}
    </div>
  );
};
 
export default BillingHistory;