"use client";
import { useEffect, useState } from "react";
import { Metadata } from "next";
import { PlusCircleIcon, DownloadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Menu } from "@/app/menu";
import { Sidebar } from "@/app/sidebar";
import { listenNowAlbums } from "./data/album";
import { AlbumArtwork } from "@/app/album-artwork";
import { LoadingSpinner } from "@/components/ui/loader";

import useSWR from "swr";
import Link from "next/link";

const fetchWithToken = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const errorRes = await res.json();
    const error = new Error();
    error.message = errorRes?.error;
    throw error;
  }
  return await res.json();
};

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

function checkUrlPatterns(url: string) {
  const patterns = [
    /ww\.mirrobox\.com/,
    /www\.nephobox\.com/,
    /freeterabox\.com/,
    /www\.freeterabox\.com/,
    /1024tera\.com/,
    /4funbox\.co/,
    /www\.4funbox\.com/,
    /mirrobox\.com/,
    /nephobox\.com/,
    /terabox\.app/,
    /terabox\.com/,
    /www\.terabox\.ap/,
    /terabox\.fun/,
    /www\.terabox\.com/,
    /www\.1024tera\.co/,
    /www\.momerybox\.com/,
    /teraboxapp\.com/,
    /momerybox\.com/,
    /tibibox\.com/,
    /www\.tibibox\.com/,
    /www\.teraboxapp\.com/,
  ];

  if (!isValidUrl(url)) {
    return false;
  }

  for (const pattern of patterns) {
    if (pattern.test(url)) {
      return true;
    }
  }

  return false;
}

export default function MusicPage() {
  const [fetchingInfo, setFetchingInfo] = useState(false);
  const [fileName, setFileName] = useState("Dummy File Name");
  const [fileSize, setFileSize] = useState("-1B");
  const [link, setLink] = useState("");
  const [err, setError] = useState("");
  const [disableInput, setdisableInput] = useState(false);
  const [thumb, setThumb] = useState("");
  const [video, setVideo] = useState("");

  const [title, setTitle] = useState("Fetching Information...");

  const { data, error } = useSWR(
    () => (link ? `/api?data=${encodeURIComponent(link)}` : null),
    fetchWithToken
  );

  useEffect(() => {
    if (data || error) {
      console.log("data", data);
      if (!data || !data.thumb || !data.direct_link) {
        // If data is missing or doesn't contain the necessary links, handle the error
        setFileName("Link deleted");
        setTitle("Link deleted, Invalid Link");
        console.error("Data is missing necessary links");
        setdisableInput(false); // Enable user input again
        setFetchingInfo(false);
        return; // Exit early
      }

      setFetchingInfo(false);
      setThumb(data?.thumb ?? "Thumbnail");
      setVideo(data?.direct_link ?? "direct_link");
      setFileName(data?.file_name ?? "Dummy File Name");
      setFileSize(data?.size ?? "-1B");
      setLink("");
    }
    if (err || error) {
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  }, [data, error]);

  async function Submit() {
    setError("");
    setdisableInput(true);
    if (!link) {
      setError("Please enter a link");
      return;
    }
    if (!checkUrlPatterns(link)) {
      setError("Invalid Link");
      return;
    }

    setFetchingInfo(true);
    setFileName("Fetching...");
    setFileSize("Fetching...");
    setLink(link);
  }

  const startDownload = async () => {
    console.log("download clicked");
    console.log("link", video);
    // Implement download logic
    if (video) {
      // Check if video is not undefined or null
    }
  };

  return (
    <>
      <div className="">
        <Menu />
        <div className="border-t">
          <div className="bg-background">
            <div className="grid lg:grid-cols-5">
              <Sidebar playlists={[]} className="hidden lg:block" />
              <div className="col-span-3 lg:col-span-4 lg:border-l">
                <div className="h-full px-2 py-6 lg:px-8">
                  <div className="py-2 gap-4 md:gap-6 space-between flex items-center">
                    <Input
                      placeholder="Enter terrabox Url"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      disabled={fetchingInfo}
                    />
                    <div className="ml-auto mr-4">
                      <Button onClick={Submit} disabled={fetchingInfo}>
                        <PlusCircleIcon className="mr-2 h-4 w-4" />
                        Fetch Link
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between flex-col lg:flex-row">
                    <div className="space-y-1 ">
                      <h2 className="text-2xl font-semibold tracking-tight">
                        {title}
                      </h2>
                      <p className="text-sm text-muted-foreground">Thumbnail</p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="">
                    <div className="py-2 gap-4 md:gap-6 space-between flex items-center">
                      <div className="w-2/3 relative">
                        {/**Video player component */}
                        <video
                          controls
                          className="w-full h-auto md:h-full"
                          src={video}
                          poster={thumb}
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                      <div className="w-1/3 relative">
                        {/**Thumbnail image */}
                        <img
                          src={thumb}
                          alt="Thumbnail"
                          className="w-full h-auto md:h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                  <div className=" py-2 gap-x-2 md:gap-x-6 items-center flex grid-cols-3 ">
                    <Label className="text-sm md:text-lg">File Name</Label>
                    <Label className="text-sm md:text-lg line-clamp-1">
                      {fileName}
                    </Label>
                    <Label className="text-sm md:text-lg">File Size</Label>
                    <Label className="text-sm md:text-lg line-clamp-1">
                      {fileSize}
                    </Label>

                    <Button onClick={startDownload} disabled={fetchingInfo}>
                      {fetchingInfo ? (
                        <LoadingSpinner size={20} />
                      ) : (
                        <div className="flex flex-row gap-2 items-center">
                          <DownloadIcon className="h-4 w-4" />
                          <Link
                            href={video}
                            target="_blank"
                            rel="noopener noreferrer"
                            className=""
                          >
                            Download
                          </Link>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
