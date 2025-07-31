import React, { useState, useEffect } from 'react';
import { createLessonApi, updateLessonApi } from '../services/api';
import { toast } from 'react-toastify';
import base_url from '../services/base_url';

function LessonForm({ courseId, lesson, onLessonCreated, onCancel }) {
  const [formLesson, setFormLesson] = useState({
    title: '',
    content: '',
    videoUrl: '',
    resources: [],
    order: '',
    _id: null,
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (!courseId) {
      toast.error('Invalid course ID');
      return;
    }
    if (lesson && lesson._id) {
      console.log('Populating lesson form with:', lesson);
      setFormLesson({
        title: lesson.title || '',
        content: lesson.content || '',
        videoUrl: lesson.videoUrl || '',
        resources: [], // New files will be added; existing resources are not re-displayed for editing
        order: lesson.order?.toString() || '',
        _id: lesson._id || null,
      });
      setIsEditMode(true);
    } else {
      setFormLesson({
        title: '',
        content: '',
        videoUrl: '',
        resources: [],
        order: '',
        _id: null,
      });
      setIsEditMode(false);
    }
  }, [lesson, courseId]);

  const validateYouTubeUrl = (url) => {
    if (!url) return true;
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/)?([a-zA-Z0-9_-]{11}).*/;
    return regex.test(url);
  };

  const handleSubmit = async () => {
    if (!courseId) {
      toast.error('Invalid course ID');
      return;
    }
    if (!formLesson.title || !formLesson.content || !formLesson.order) {
      toast.error('Title, content, and order are required');
      return;
    }
    if (isNaN(parseInt(formLesson.order)) || parseInt(formLesson.order) < 0) {
      toast.error('Order must be a non-negative number');
      return;
    }
    if (formLesson.videoUrl && !validateYouTubeUrl(formLesson.videoUrl)) {
      toast.error('Invalid YouTube URL');
      return;
    }
    const formData = new FormData();
    formData.append('title', formLesson.title);
    formData.append('content', formLesson.content);
    formData.append('videoUrl', formLesson.videoUrl);
    formData.append('order', formLesson.order);
    formLesson.resources.forEach(resource => formData.append('resources', resource));

    try {
      if (isEditMode) {
        if (!formLesson._id) {
          toast.error('Invalid lesson ID');
          return;
        }
        await updateLessonApi(formLesson._id, formData);
        toast.success('Lesson updated successfully');
      } else {
        await createLessonApi(courseId, formData);
        toast.success('Lesson created successfully');
      }
      setFormLesson({ title: '', content: '', videoUrl: '', resources: [], order: '', _id: null });
      setIsEditMode(false);
      onLessonCreated();
      onCancel();
    } catch (error) {
      toast.error(error.message || `Failed to ${isEditMode ? 'update' : 'create'} lesson`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-2xl font-semibold mb-4">{isEditMode ? 'Edit Lesson' : 'Add Lesson'}</h2>
      <input
        type="text"
        placeholder="Lesson Title"
        value={formLesson.title}
        onChange={(e) => setFormLesson({ ...formLesson, title: e.target.value })}
        className="w-full p-2 mb-4 border rounded"
      />
      <textarea
        placeholder="Content"
        value={formLesson.content}
        onChange={(e) => setFormLesson({ ...formLesson, content: e.target.value })}
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        type="text"
        placeholder="YouTube Video URL (optional)"
        value={formLesson.videoUrl}
        onChange={(e) => setFormLesson({ ...formLesson, videoUrl: e.target.value })}
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        type="file"
        accept=".pdf,.docx"
        multiple
        onChange={(e) => setFormLesson({ ...formLesson, resources: Array.from(e.target.files) })}
        className="mb-4"
      />
      {isEditMode && lesson?.resources?.length > 0 && (
        <div className="mb-4">
          <p className="font-semibold">Existing Resources:</p>
          <ul>
            {lesson.resources.map((resource, index) => (
              <li key={resource || `resource-${index}`}>
                <a href={`${base_url}/Uploads/${resource}`} className="text-blue-500 hover:underline">{resource}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <input
        type="number"
        placeholder="Order (e.g., 1)"
        value={formLesson.order}
        onChange={(e) => setFormLesson({ ...formLesson, order: e.target.value })}
        className="w-full p-2 mb-4 border rounded"
        min="0"
      />
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {isEditMode ? 'Update Lesson' : 'Create Lesson'}
        </button>
      </div>
    </div>
  );
}

export default LessonForm;