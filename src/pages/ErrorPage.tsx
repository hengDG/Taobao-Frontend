import { RefreshCcw } from "lucide-react";


type ServerErrorProps = {
  onRetry?: () => void;
};


export default function ServerError({
  onRetry,
}: ServerErrorProps) {

  return (

    <div
      className="
      mt-5
        flex
        min-h-[350px]
        flex-col
        items-center
        justify-center
        gap-4
        text-center
        px-5
        mb-10
      "
    >

      {/* Video */}
      <video
        src="/videos/server-error.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="
          h-60
          w-60
          object-contain
        "
      />


      <div>

        <h2
          className="
            text-lg
            font-bold
            text-slate-800
          "
        >
          Server is temporarily unavailable
        </h2>


        <p
          className="
            mt-1
            text-sm
            text-slate-500
          "
        >
          We are reconnecting. Please try again later.
        </p>

      </div>



      <button

        onClick={onRetry}

        className="
          flex
          items-center
          gap-2
          rounded-full
          bg-[#194891]
          px-5
          py-2
          text-sm
          font-semibold
          text-white
          transition
          hover:bg-[#12376e]
        "

      >

        <RefreshCcw size={15}/>

        Retry

      </button>


    </div>

  );
}