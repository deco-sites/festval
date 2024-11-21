export interface VideoProps {
  videoId: string;
}

const Video = ({ videoId }: VideoProps) => {
  const videoSrc = `${videoId}`;

  return (
    <div class="video-container flex w-full h-full  m-auto relative">
      <div class="video-overlay"></div>
      <iframe
        class="lazy-iframe min-h-[180px] w-full md:h-full"
        src={videoSrc}
        title="YouTube video"
        frameBorder="0"
        allow=" autoplay;"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default Video;
