import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const getVideoDuration = (source) => {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      resolve(video.duration);
    };

    video.onerror = () => {
      resolve(0); // If there's an error, return 0
    };
  });
};

const EditContentPage = () => {
  const navigate = useNavigate();
  const { courseId, sectionId } = useParams();
  const [sectionName, setSectionName] = useState("Section 1");

  const [content, setContent] = useState([]);

  const [newContent, setNewContent] = useState({
    content_name: "",
    type: "video",
    source: "",
    content_url: "",
    isFileUpload: false,
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setNewContent({ ...newContent, [field]: value });
  };

  const handleFileUpload = (file) => {
    if (file) {
      const fileType = file.type.includes("video") ? "video" : "document";
      setNewContent({ ...newContent, type: fileType, source: file, isFileUpload: true });
    }
  };

  const uploadContent = async () => {
    setLoading(true);

    let duration = 1;

    if (newContent.title && (newContent.source || newContent.content_url)) {
      const formData = new FormData();

      formData.append("section_id", sectionId);
      formData.append("content_name", newContent.title);
      formData.append("content_media_type", newContent.type);

      if (newContent.isFileUpload) {
        formData.append("content_asset", newContent.source);
        formData.append("duration", duration);
      } else {
        formData.append("content_url", newContent.content_url);
      }

      formData.append("position", content.length + 1);

      try {
        const res = await axios.post(`http://localhost:8080/api/instructor/addSectionContent`, formData, {
          withCredentials: true,
        });

        toast.success("Content added successfully!");
        getContentData();
      } catch (error) {
        toast.error(error.response?.data?.error || "Upload failed");
        console.error(error);
      }

      setNewContent({ title: "", type: "video", source: "", isFileUpload: false });
    }
    else {
      toast.warning("provide all information")
    }

    setLoading(false);
  };

  const getContentData = async () => {
    try {
      const res = await axios.post(`http://localhost:8080/api/instructor/getSectionContent`, {
        section_id: sectionId,
      }, {
        withCredentials: true,
      });

      setContent(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteContent = async (contentId) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/instructor/deleteSectionContent/${contentId}`, {
        withCredentials: true,
      });

      toast.success("Content deleted successfully!");
      getContentData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete content");
    }
  };

  useEffect(() => {
    getContentData();
  }, []);

  return (
    <div className="p-6 w-full h-screen flex">
      {/* Input Section (25%) */}
      <div className="h-full w-2/6 p-6 border-r bg-white flex flex-col justify-center relative">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-80 z-50 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            <p className="mt-2 text-sm font-semibold text-blue-600">Uploading...</p>
          </div>
        )}

        <h2 className="text-xl font-bold mb-4 text-gray-700">Add New Content</h2>
        <div className="space-y-4">
          <Input
            className="p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Content Title"
            value={newContent.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
          />

          <label className="block text-sm font-semibold text-gray-700">Content Type</label>
          <select
            className="p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newContent.type}
            onChange={(e) => handleInputChange("type", e.target.value)}
          >
            <option value="video">Video</option>
            <option value="document">Document</option>
          </select>

          <label className="block text-sm font-semibold text-gray-700">Content Source</label>
          <select
            className="p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newContent.isFileUpload ? "file" : "url"}
            onChange={(e) => handleInputChange("isFileUpload", e.target.value === "file")}
          >
            <option value="url">URL</option>
            <option value="file">Upload File</option>
          </select>

          {newContent.isFileUpload ? (
            <input
              type="file"
              accept={ newContent.type == "video" ? "video/*" : ".pdf" }
              className="p-3 border rounded w-full"
              onChange={(e) => handleFileUpload(e.target.files[0])}
            />
          ) : (
            <Input
              className="p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter URL"
              value={newContent.content_url}
              onChange={(e) => handleInputChange("content_url", e.target.value)}
            />
          )}

          <Button
            className="bg-blue-600 text-white font-semibold w-full rounded-md p-3 hover:bg-blue-700"
            onClick={uploadContent}
            disabled={loading}
          >
            Upload
          </Button>
        </div>
      </div>

      {/* Created Content Section (75%) */}
      <div className="w-4/6 p-6 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-700">Already Created Content</h2>
        {content && content.length > 0 && content.map((content) => (
          <div key={content._id} className="border p-3 rounded flex items-center justify-between bg-gray-50 mb-3">
            <div className="gap-4 w-11/12">
              <p className="font-semibold text-gray-700">Title : {content.content_name}</p>
              <p className="truncate">{content.content_media_type} : <span className="text-blue-600"><a href={`${content.content_url}`}>{content.content_url}</a></span></p>
            </div>
            <Button
              className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
              onClick={() => handleDeleteContent(content._id)}
            >
              <FaTrash />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditContentPage;
