import React, { useState, useEffect } from 'react';
import { PDFDownloadLink, Document, Page, Text } from '@react-pdf/renderer';
import { FiDownload } from 'react-icons/fi';
import { updateProgressApi, getProgressApi } from '../services/api';
import { toast } from 'react-toastify';

const base_url = "http://localhost:5000";

const MyPDF = ({ resource }) => (
  <Document>
    <Page>
      <Text>{resource}</Text>
    </Page>
  </Document>
);

function LessonViewer({ lesson, courseId, onProgressUpdate, videoCardHeight = "h-96" }) {
  const [watched, setWatched] = useState(false);
  const [watchedTime, setWatchedTime] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const progress = await getProgressApi(courseId, lesson._id);
        if (progress?.watched) {
          setWatched(true);
          const watchedTime = progress.watchedTime ? new Date(progress.watchedTime) : null;
          setWatchedTime(watchedTime);
          sessionStorage.setItem(
            `progress_${courseId}_${lesson._id}`,
            JSON.stringify({ watched: true, watchedTime })
          );
        } else {
          const cachedProgress = JSON.parse(sessionStorage.getItem(`progress_${courseId}_${lesson._id}`));
          if (cachedProgress?.watched) {
            setWatched(true);
            setWatchedTime(cachedProgress.watchedTime ? new Date(cachedProgress.watchedTime) : null);
          }
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
        if (error.message.includes('No token found')) {
          toast.error('Session expired. Please log in again.');
        } else {
          toast.error('Failed to load lesson progress');
        }
      }
    };
    fetchProgress();
  }, [courseId, lesson._id]);

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/)?([a-zA-Z0-9_-]{11}).*/;
    const match = url.match(regex);
    return match ? `https://www.youtube.com/embed/${match[5]}` : null;
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return '';
    const now = new Date();
    const hoursDiff = Math.floor((now - new Date(timestamp)) / (1000 * 60 * 60));
    if (hoursDiff < 1) return 'Less than an hour ago';
    if (hoursDiff === 1) return '1 hour ago';
    return `${hoursDiff} hours ago`;
  };

  const handleWatched = async () => {
    if (watched) return;
    try {
      setLoading(true);
      const response = await updateProgressApi(courseId, lesson._id, { watched: true });
      if (response.status === 200) {
        const currentTime = new Date().toISOString();
        setWatched(true);
        setWatchedTime(currentTime);
        sessionStorage.setItem(
          `progress_${courseId}_${lesson._id}`,
          JSON.stringify({
            watched: true,
            watchedTime: currentTime,
          })
        );
        onProgressUpdate();
        toast.success('Lesson marked as watched');
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (error) {
      console.error('Error in handleWatched:', error);
      toast.error(error.message || 'Failed to mark lesson as watched');
    } finally {
      setLoading(false);
    }
  };

  const embedUrl = getYouTubeEmbedUrl(lesson.videoUrl);

  if (loading && !watched) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold">{lesson.title}</h3>
      <p className="text-gray-600">{lesson.content}</p>

      {embedUrl ? (
        <div className="mt-4">
          <iframe
            width="100%"
            className={videoCardHeight}
            src={embedUrl}
            title={lesson.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onEnded={handleWatched}
          ></iframe>
        </div>
      ) : lesson.videoUrl ? (
        <p className="text-red-500 mt-4">Invalid YouTube URL</p>
      ) : null}

      {lesson.resources.length > 0 && (
        <div className="mt-4">
          <h4 className="text-md font-semibold">Resources</h4>
          {lesson.resources.map((resource, index) => (
            <div key={index} className="flex items-center gap-4 mt-2">
              {/* Direct file download link */}
              <a
                href={`${base_url}/Uploads/${resource}`}
                download
                className="text-blue-600 hover:underline"
              >
                {resource}
              </a>

              {/* PDF download icon */}
              <PDFDownloadLink
                document={<MyPDF resource={resource} />}
                fileName={`${resource}.pdf`}
              >
                {({ loading }) =>
                  loading ? (
                    <span className="text-gray-400 text-sm">Generating...</span>
                  ) : (
                    <button
                      title="Download as PDF"
                      className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600"
                    >
                      <FiDownload size={18} />
                    </button>
                  )
                }
              </PDFDownloadLink>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center">
        <button
          onClick={handleWatched}
          disabled={watched || loading}
          className={`px-4 py-2 rounded ${
            watched ? 'bg-gray-400' : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {watched ? 'Watched' : 'Mark as Watched'}
        </button>
        {watched && watchedTime && (
          <span className="ml-4 text-gray-500">{getTimeAgo(watchedTime)}</span>
        )}
      </div>
    </div>
  );
}

export default LessonViewer;
