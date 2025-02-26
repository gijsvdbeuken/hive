import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1>Hello World</h1>
      <div className="bg-white bg-opacity-10 rounded-full">
        <input
          placeholder="Stel een vraag..."
          className="w-[400px] h-[50px] p-4 bg-transparent"
        ></input>
        <button className="bg-black h-[40px] w-[40px] rounded-full mx-1">
          A
        </button>
      </div>
    </div>
  );
}
