"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Cropper from "react-easy-crop";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { Upload, Image as ImageIcon, Sparkles, Heart, ArrowLeft, Send, MapPin, Film, Gift, MessageCircle, Crop, X, Check } from "lucide-react";
import { useRouter } from "next/navigation";

// Crop utility function
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Canvas is empty"));
      }
    }, "image/jpeg");
  });
}

export default function CreateMemoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  
  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");

  // Crop state
  const [cropModal, setCropModal] = useState<{
    isOpen: boolean;
    imageIndex: number;
    imageSrc: string;
  }>({
    isOpen: false,
    imageIndex: -1,
    imageSrc: "",
  });
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const [activeCard, setActiveCard] = useState<number | null>(null);

  const memoryTypes = [
    {
      icon: MapPin,
      title: "Special Place",
      color: "from-blue-500 to-cyan-500",
      iconColor: "text-blue-500",
      placeholder: "e.g. Marina Beach, Paris, Coffee Shop...",
      questionPlaceholder: "Where did we...?",
      storyPlaceholder: "What made this place special? Describe the moment when you were here together...",
      description: "A location that holds a precious memory for both of you"
    },
    {
      icon: Film,
      title: "Movie Together",
      color: "from-purple-500 to-pink-500",
      iconColor: "text-purple-500",
      placeholder: "e.g. Titanic, Avengers, 3 Idioms...",
      questionPlaceholder: "What movie did we watch?",
      storyPlaceholder: "Why was watching this movie together special? What do you remember most about that day?",
      description: "A film you watched together that became a cherished memory"
    },
    {
      icon: Gift,
      title: "Special Gift",
      color: "from-rose-500 to-orange-500",
      iconColor: "text-rose-500",
      placeholder: "e.g. Handmade card, Teddy bear, Book...",
      questionPlaceholder: "What gift did I give you?",
      storyPlaceholder: "Tell the story behind this gift. What made it so meaningful?",
      description: "A gift that touched your heart"
    }
  ];

  const [memories, setMemories] = useState([
    { image: "", answer: "", story: "", question: "Where was this special place?" },
    { image: "", answer: "", story: "", question: "What movie did we watch together?" },
    { image: "", answer: "", story: "", question: "What special gift was this?" },
  ]);

  // Temporary storage for uncropped images
  const [tempImages, setTempImages] = useState<{ [key: number]: string }>({});

  const handleImageSelect = async (file: File, index: number) => {
    const reader = new FileReader();
    reader.onload = () => {
      const imageSrc = reader.result as string;
      setTempImages((prev) => ({ ...prev, [index]: imageSrc }));
      setCropModal({
        isOpen: true,
        imageIndex: index,
        imageSrc,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleCropSave = async () => {
    try {
      if (!croppedAreaPixels || cropModal.imageIndex === -1) return;

      const croppedBlob = await getCroppedImg(
        cropModal.imageSrc,
        croppedAreaPixels
      );

      // Convert blob to file for upload
      const croppedFile = new File([croppedBlob], "cropped-image.jpg", {
        type: "image/jpeg",
      });

      // Upload to Cloudinary
      const url = await uploadToCloudinary(croppedFile);

      const updated = [...memories];
      updated[cropModal.imageIndex].image = url;
      setMemories(updated);

      // Close modal and reset
      setCropModal({ isOpen: false, imageIndex: -1, imageSrc: "" });
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
    } catch (error) {
      console.error("Error cropping image:", error);
      alert("Failed to crop image. Please try again.");
    }
  };

  const handleCropCancel = () => {
    setCropModal({ isOpen: false, imageIndex: -1, imageSrc: "" });
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  const handleEditImage = (index: number) => {
    const imageUrl = memories[index].image;
    setCropModal({
      isOpen: true,
      imageIndex: index,
      imageSrc: imageUrl,
    });
  };

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...memories];
    // @ts-ignore
    updated[index][field] = value;
    setMemories(updated);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        creatorName: senderName || "You",
        partnerName: receiverName || "Partner",

        placeImageUrl: memories[0].image,
        placeStory: memories[0].story,
        placeQuestion: memories[0].question,
        placeAnswer: memories[0].answer,

        movieImageUrl: memories[1].image,
        movieStory: memories[1].story,
        movieQuestion: memories[1].question,
        movieAnswer: memories[1].answer,

        giftImageUrl: memories[2].image,
        giftStory: memories[2].story,
        giftQuestion: memories[2].question,
        giftAnswer: memories[2].answer,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/memory-games`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Backend error:", text);
        alert("Something went wrong while creating the memory game");
        setLoading(false);
        return;
      }

      const data = await res.json();

      const link = `${window.location.origin}/games/day2/memory/${data.id}`;
      setShareLink(link);
      setShowSuccessModal(true);

    } catch (err) {
      console.error("Network error:", err);
      alert("Cannot connect to server. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  const isComplete = memories.every(m => m.image && m.answer && m.story && m.question) && senderName && receiverName;

  return (
    <div className="min-h-screen bg-[#FFF9F5] relative overflow-hidden">
      
      {/* Premium background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Soft mesh gradient */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(at 20% 30%, hsla(330, 100%, 96%, 1) 0px, transparent 50%),
              radial-gradient(at 80% 70%, hsla(340, 100%, 95%, 1) 0px, transparent 50%),
              radial-gradient(at 40% 80%, hsla(280, 100%, 96%, 1) 0px, transparent 50%),
              radial-gradient(at 90% 20%, hsla(350, 100%, 94%, 1) 0px, transparent 50%)
            `,
          }}
        />

        {/* Subtle noise */}
        <div 
          className="absolute inset-0 opacity-[0.012]"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulance type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          }}
        />

        {/* Floating hearts */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-rose-200/15"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              rotate: [0, 15, -15, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            <Heart size={16 + Math.random() * 20} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 py-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <button
            onClick={() => router.push("/games/day2")}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-rose-600 transition-colors mb-6 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Propose Day</span>
          </button>

          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-block mb-4"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.6, 0.4],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                  className="absolute inset-0 blur-2xl bg-gradient-to-br from-purple-300 to-rose-300 rounded-full"
                />
                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-rose-500 flex items-center justify-center shadow-[0_10px_40px_rgba(168,85,247,0.4)]">
                  <Heart className="text-white" size={32} fill="white" />
                </div>
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-light text-slate-900 mb-4 tracking-tight">
              Create Your{" "}
              <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-br from-purple-600 via-rose-600 to-pink-600">
                Memory Game
              </span>
            </h1>
            <p className="text-lg text-slate-600/80 font-light max-w-2xl mx-auto">
              Share three treasured memories — a special place, a movie you watched together, and a meaningful gift.
              <br />
              <span className="text-purple-600 font-medium">Your partner will guess, then discover the beautiful stories behind each one.</span>
            </p>
          </div>

          {/* Name Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 max-w-2xl mx-auto"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-rose-100/50 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <div className="grid sm:grid-cols-2 gap-5">
                
                {/* Sender Name */}
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                    <Heart size={16} className="text-purple-500" fill="currentColor" />
                    Your Name
                  </span>
                  <input
                    type="text"
                    className="w-full px-5 py-3.5 rounded-xl border border-rose-200/50 bg-white/60 backdrop-blur-sm
                               focus:border-purple-400/60 focus:ring-4 focus:ring-purple-100/50 focus:bg-white
                               transition-all outline-none text-slate-800 placeholder:text-slate-400 font-light"
                    placeholder="e.g. Rupa"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                  />
                </label>

                {/* Receiver Name */}
                <label className="block">
                  <span className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                    <Sparkles size={16} className="text-rose-500" />
                    Partner's Name
                  </span>
                  <input
                    type="text"
                    className="w-full px-5 py-3.5 rounded-xl border border-rose-200/50 bg-white/60 backdrop-blur-sm
                               focus:border-purple-400/60 focus:ring-4 focus:ring-purple-100/50 focus:bg-white
                               transition-all outline-none text-slate-800 placeholder:text-slate-400 font-light"
                    placeholder="e.g. Rahul"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                  />
                </label>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Memory Cards */}
        <div className="space-y-6 mb-12">
          {memories.map((m, i) => {
            const memoryType = memoryTypes[i];
            const Icon = memoryType.icon;
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.15 }}
                onFocus={() => setActiveCard(i)}
                onBlur={() => setActiveCard(null)}
                className="group"
              >
                <div className={`
                  relative bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8
                  border transition-all duration-500
                  ${activeCard === i 
                    ? 'border-purple-300/60 shadow-[0_20px_60px_rgba(168,85,247,0.15)]' 
                    : 'border-rose-100/50 shadow-[0_8px_30px_rgba(0,0,0,0.04)]'
                  }
                `}>
                  
                  {/* Card header with icon and title */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${memoryType.color} flex items-center justify-center shadow-lg`}
                      >
                        <Icon className="text-white" size={26} />
                      </motion.div>
                      
                      <div>
                        <h3 className="text-2xl font-semibold text-slate-800 mb-1">
                          {memoryType.title}
                        </h3>
                        <p className="text-sm text-slate-500 font-light">
                          {memoryType.description}
                        </p>
                      </div>
                    </div>

                    <div className="px-4 py-1.5 bg-gradient-to-r from-purple-500 to-rose-500 text-white text-sm font-semibold rounded-full shadow-lg">
                      {i + 1} of 3
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    
                    {/* Image Upload Section */}
                    <div className="space-y-4">
                      <label className="block">
                        <span className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                          <ImageIcon size={16} className={memoryType.iconColor} />
                          Upload Photo
                        </span>
                        
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="relative"
                        >
                          {m.image ? (
                            // Image preview with edit option
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group/img border-2 border-rose-200/50">
                              <img 
                                src={m.image} 
                                alt={memoryType.title}
                                className="w-full h-full object-cover"
                              />
                              
                              {/* Overlay on hover */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end p-6">
                                <div className="flex gap-3 w-full">
                                  <button
                                    onClick={() => handleEditImage(i)}
                                    className="flex-1 cursor-pointer text-white text-sm font-medium flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm py-2 px-4 rounded-lg hover:bg-white/30 transition-all"
                                  >
                                    <Crop size={16} />
                                    Edit Crop
                                  </button>
                                  <label className="flex-1 cursor-pointer text-white text-sm font-medium flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm py-2 px-4 rounded-lg hover:bg-white/30 transition-all">
                                    <Upload size={16} />
                                    Replace
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => e.target.files && handleImageSelect(e.target.files[0], i)}
                                      className="hidden"
                                    />
                                  </label>
                                </div>
                              </div>
                            </div>
                          ) : (
                            // Upload placeholder
                            <label className="block aspect-[4/3] border-2 border-dashed border-rose-300/50 rounded-2xl cursor-pointer hover:border-purple-400/60 hover:bg-purple-50/30 transition-all group/upload">
                              <div className="h-full flex flex-col items-center justify-center gap-3 p-6">
                                <motion.div
                                  animate={{
                                    y: [0, -8, 0],
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                  }}
                                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${memoryType.color}/20 flex items-center justify-center group-hover/upload:from-purple-200 group-hover/upload:to-rose-200 transition-colors`}
                                >
                                  <Upload className={memoryType.iconColor} size={24} />
                                </motion.div>
                                <div className="text-center">
                                  <p className="text-slate-700 font-medium mb-1">Upload Photo</p>
                                  <p className="text-xs text-slate-500">PNG, JPG up to 10MB</p>
                                </div>
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => e.target.files && handleImageSelect(e.target.files[0], i)}
                                className="hidden"
                              />
                            </label>
                          )}
                        </motion.div>
                      </label>
                    </div>

                    {/* Details Section */}
                    <div className="space-y-5">
                      
                      {/* Question Input */}
                      <label className="block">
                        <span className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                          <MessageCircle size={16} className={memoryType.iconColor} />
                          Ask Your Partner
                        </span>
                        <input
                          type="text"
                          className="w-full px-5 py-3.5 rounded-xl border border-rose-200/50 bg-white/60 backdrop-blur-sm
                                     focus:border-purple-400/60 focus:ring-4 focus:ring-purple-100/50 focus:bg-white
                                     transition-all outline-none text-slate-800 placeholder:text-slate-400 font-light"
                          placeholder={memoryType.questionPlaceholder}
                          value={m.question}
                          onChange={(e) => handleChange(i, "question", e.target.value)}
                        />
                      </label>

                      {/* Answer Input */}
                      <label className="block">
                        <span className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                          <Sparkles size={16} className={memoryType.iconColor} />
                          The Answer
                        </span>
                        <input
                          type="text"
                          className="w-full px-5 py-3.5 rounded-xl border border-rose-200/50 bg-white/60 backdrop-blur-sm
                                     focus:border-purple-400/60 focus:ring-4 focus:ring-purple-100/50 focus:bg-white
                                     transition-all outline-none text-slate-800 placeholder:text-slate-400 font-light"
                          placeholder={memoryType.placeholder}
                          value={m.answer}
                          onChange={(e) => handleChange(i, "answer", e.target.value)}
                        />
                      </label>

                      {/* Story Textarea */}
                      <label className="block">
                        <span className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                          <Heart size={16} className="text-pink-500" fill="currentColor" />
                          The Story Behind It
                        </span>
                        <textarea
                          className="w-full px-5 py-3.5 rounded-xl border border-rose-200/50 bg-white/60 backdrop-blur-sm
                                     focus:border-purple-400/60 focus:ring-4 focus:ring-purple-100/50 focus:bg-white
                                     transition-all outline-none text-slate-800 placeholder:text-slate-400 font-light
                                     resize-none h-32"
                          placeholder={memoryType.storyPlaceholder}
                          value={m.story}
                          onChange={(e) => handleChange(i, "story", e.target.value)}
                        />
                      </label>

                      {/* Completion indicator */}
                      <div className="flex items-center gap-2 pt-2">
                        <div className="flex gap-1.5">
                          {[m.image, m.question, m.answer, m.story].map((field, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ scale: 0 }}
                              animate={{ scale: field ? 1 : 0.6 }}
                              className={`w-2 h-2 rounded-full transition-all ${
                                field ? `bg-gradient-to-r ${memoryType.color}` : 'bg-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-slate-500 font-light">
                          {[m.image, m.question, m.answer, m.story].filter(Boolean).length}/4 complete
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col items-center gap-6 pb-12"
        >
          <motion.button
            onClick={handleSubmit}
            disabled={!isComplete || loading}
            whileHover={isComplete && !loading ? { scale: 1.03, y: -2 } : {}}
            whileTap={isComplete && !loading ? { scale: 0.98 } : {}}
            className={`
              group relative px-12 py-5 rounded-full font-semibold text-lg overflow-hidden
              transition-all duration-300
              ${isComplete && !loading
                ? 'shadow-[0_20px_50px_rgba(168,85,247,0.35)] cursor-pointer'
                : 'opacity-50 cursor-not-allowed shadow-lg'
              }
            `}
          >
            {/* Animated gradient background */}
            <motion.div
              animate={isComplete && !loading ? {
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              } : {}}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
              className="absolute inset-0 bg-gradient-to-r from-purple-500 via-rose-500 to-pink-500 bg-[length:200%_100%]"
            />
            
            {/* Top highlight */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
            
            {/* Hover glow */}
            {isComplete && !loading && (
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: "radial-gradient(circle at center, rgba(255,255,255,0.25), transparent 70%)",
                }}
              />
            )}
            
            <span className="relative text-white flex items-center gap-3 tracking-wide">
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles size={20} />
                  </motion.div>
                  Creating Magic...
                </>
              ) : (
                <>
                  Create Memory Game
                  <Send size={20} />
                </>
              )}
            </span>
          </motion.button>

          {/* Helper text */}
          {!isComplete && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-slate-500/80 font-light flex items-center gap-2"
            >
              <Sparkles size={14} className="text-purple-400" />
              {!senderName || !receiverName 
                ? "Please enter both names to continue" 
                : "Complete all fields in each memory to continue"}
            </motion.p>
          )}

          {/* Progress indicator */}
          <div className="flex items-center gap-3">
            {memories.map((m, i) => {
              const complete = m.image && m.question && m.answer && m.story;
              const Icon = memoryTypes[i].icon;
              
              return (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                  className="relative"
                >
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-500
                    ${complete 
                      ? `bg-gradient-to-br ${memoryTypes[i].color} text-white shadow-[0_8px_20px_rgba(168,85,247,0.3)]` 
                      : 'bg-slate-200/50 text-slate-400'
                    }
                  `}>
                    {complete ? <Icon size={20} /> : <Icon size={20} className="opacity-50" />}
                  </div>
                  
                  {/* Connecting line */}
                  {i < memories.length - 1 && (
                    <div className={`
                      absolute top-1/2 left-full w-8 h-0.5 -translate-y-1/2 transition-all duration-500
                      ${complete && memories[i + 1].image && memories[i + 1].question && memories[i + 1].answer && memories[i + 1].story
                        ? 'bg-gradient-to-r from-purple-500 to-rose-500'
                        : 'bg-slate-200/50'
                      }
                    `} />
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200/20 to-transparent rounded-bl-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-rose-200/20 to-transparent rounded-tr-full pointer-events-none" />

      {/* Image Crop Modal */}
      <AnimatePresence>
        {cropModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500 to-rose-500 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Crop className="text-white" size={24} />
                  <h3 className="text-xl font-semibold text-white">Crop Your Image</h3>
                </div>
                <button
                  onClick={handleCropCancel}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Cropper Area */}
              <div className="relative h-[500px] bg-slate-900">
                <Cropper
                  image={cropModal.imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={4 / 3}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>

              {/* Controls */}
              <div className="p-6 bg-slate-50 border-t border-slate-200">
                {/* Zoom Slider */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <Sparkles size={16} className="text-purple-500" />
                    Zoom
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCropCancel}
                    className="flex-1 px-6 py-3.5 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCropSave}
                    className="flex-1 px-6 py-3.5 bg-gradient-to-r from-purple-500 to-rose-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Check size={20} />
                    Apply Crop
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden"
            >
              {/* Decorative gradient */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 via-rose-500 to-pink-500" />
              
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-rose-500 rounded-full flex items-center justify-center mb-6 shadow-[0_10px_40px_rgba(168,85,247,0.4)]"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Heart className="text-white" size={36} fill="white" />
                </motion.div>
              </motion.div>

              {/* Title */}
              <h2 className="text-3xl font-serif italic text-center text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-rose-600 mb-3">
                Memory Game Created! 💝
              </h2>
              
              <p className="text-center text-slate-600 mb-6 font-light">
                Share this link with <span className="font-semibold text-purple-600">{receiverName}</span> to let them guess your special memories
              </p>

              {/* Link Display with Copy Button */}
              <div className="bg-gradient-to-br from-purple-50 to-rose-50 rounded-2xl p-4 mb-6 border border-purple-200/50">
                <div className="flex items-center gap-3">
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs text-slate-500 mb-1 font-medium">Share Link</p>
                    <p className="text-sm text-slate-700 truncate font-mono">
                      {shareLink}
                    </p>
                  </div>
                  
                  <motion.button
                    onClick={handleCopyLink}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-shrink-0 px-4 py-3 bg-gradient-to-r from-purple-500 to-rose-500 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all"
                  >
                    {copied ? (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2"
                      >
                        ✓ Copied
                      </motion.span>
                    ) : (
                      "Copy"
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: "Play My Memory Game! 💝",
                        text: `I've created a special memory game for you. Can you guess our special place, movie, and gift?`,
                        url: shareLink,
                      });
                    }
                  }}
                  className="flex-1 px-6 py-3.5 bg-white border-2 border-purple-200 text-purple-700 rounded-xl font-semibold hover:border-purple-300 hover:bg-purple-50 transition-all"
                >
                  Share
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 px-6 py-3.5 bg-gradient-to-r from-purple-500 to-rose-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Done
                </motion.button>
              </div>

              {/* Floating sparkles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    y: [0, -50],
                  }}
                  transition={{
                    duration: 2,
                    delay: 0.5 + i * 0.2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                  className="absolute"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: '30%',
                  }}
                >
                  <Sparkles size={16} className="text-purple-400" />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}