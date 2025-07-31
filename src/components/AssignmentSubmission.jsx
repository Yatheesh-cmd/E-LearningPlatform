import React, { useState } from 'react';
import { submitAssignmentApi } from '../services/api';
import { toast } from 'react-toastify';
import { FiUploadCloud } from 'react-icons/fi';

function AssignmentSubmission({ courseId, lessonId }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      await submitAssignmentApi(courseId, lessonId, formData);
      toast.success('Assignment submitted successfully!');
      setFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Submission failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 w-full max-w-md">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
        Submit Assignment
      </h3>

      <label className="flex items-center gap-3 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-500 transition">
        <FiUploadCloud className="text-2xl text-blue-500" />
        <span className="text-gray-600 dark:text-gray-300 text-sm truncate">
          {file ? file.name : 'Choose a .pdf or .docx file'}
        </span>
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
        />
      </label>

      <button
        onClick={handleSubmit}
        disabled={uploading}
        className={`mt-5 w-full py-2 rounded-lg font-medium transition ${
          uploading
            ? 'bg-blue-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white`}
      >
        {uploading ? 'Submitting...' : 'Submit Assignment'}
      </button>
    </div>
  );
}

export default AssignmentSubmission;
