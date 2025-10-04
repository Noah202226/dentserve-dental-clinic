"use client";
import { useState, useEffect } from "react";
import { databases, ID } from "../../lib/appwrite";
import toast from "react-hot-toast";

import { Query } from "appwrite";

export default function SubsectionModal({
  open,
  onClose,
  section, // { label, collectionId }
  patientId,
}) {
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]); // list of entries
  const [fetching, setFetching] = useState(true);

  // Fetch existing entries
  useEffect(() => {
    if (!open || !patientId || !section?.collectionId) return;
    const fetchData = async () => {
      setFetching(true);
      try {
        const res = await databases.listDocuments(
          process.env.NEXT_PUBLIC_DATABASE_ID,
          section.collectionId,
          [Query.equal("patientId", patientId), Query.orderDesc("$createdAt")]
        );
        setItems(res.documents);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load data");
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [open, patientId, section]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value ?? "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return toast.error("Title is required");

    setLoading(true);
    try {
      await databases.createDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        section.collectionId,
        ID.unique(),
        {
          patientId,
          name: formData.title,
          description: formData.content,
        }
      );
      toast.success(`${section.label} added!`);
      setFormData({ title: "", content: "" });
      // refresh list
      const res = await databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        section.collectionId,
        [Query.equal("patientId", patientId), Query.orderDesc("$createdAt")]
      );
      setItems(res.documents);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
      <div className="bg-base-100 p-6 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-xl">
        <h2 className="text-xl font-semibold mb-4">{section.label}</h2>

        {/* Existing Entries */}
        {fetching ? (
          <div className="text-center text-gray-500 py-4">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center text-gray-400 italic mb-4">
            No records yet.
          </div>
        ) : (
          <ul className="space-y-2 mb-5">
            {items.map((item) => (
              <li
                key={item.$id}
                className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
              >
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  {item.description}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-line">
                  {item.content}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(item.$createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}

        {/* Add New Entry Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="title"
            placeholder="Title"
            className="input input-bordered w-full"
            value={formData.title}
            onChange={handleChange}
          />
          <textarea
            name="content"
            placeholder="Content"
            className="textarea textarea-bordered w-full"
            value={formData.content}
            onChange={handleChange}
          />
          <div className="flex justify-end gap-2 pt-3">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Close
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Saving..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
