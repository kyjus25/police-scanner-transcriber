import { createFileRoute } from "@tanstack/solid-router";
import WifiIcon from "lucide-solid/icons/wifi";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <>
      <header class="bg-neutral-50 flex items-center justify-between border-neutral-300 border-b p-4 mb-4">
        <div class="flex gap-4 items-center">
          <div class="bg-blue-500 w-10 h-10 rounded-md text-white flex items-center justify-center text-2xl">
            <WifiIcon />
          </div>
          <div>
            <p class="font-bold text-lg">SignalWatch</p>
            <p class="text-xs text-neutral-600">
              Real-time police/EMS transcription and monitoring
            </p>
          </div>
        </div>
        <div>
          <div class="bg-white py-2 px-3 border border-neutral-300 rounded-md flex items-center justify-between w-96">
            <div>
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <p class="text-sm font-semibold">Champaign County EMS</p>
              </div>
              <p class="text-xs text-neutral-600">Police • Champaign IL</p>
            </div>
            <div>
              <i class="pi pi-chevron-down"></i>
            </div>
          </div>
        </div>
      </header>
      <article class="container mx-auto px-4">
        <div class="flex items-center justify-between mb-4">
          <div>
            <div class="flex gap-2">
              <p class="font-bold text-lg">Champaign County - Law Dispatch</p>
              <div class="flex items-center justify-center bg-blue-100 text-blue-500 px-2 text-xs rounded-md">
                Police • Dispatch
              </div>
            </div>
            <div class="flex items-center gap-1">
              <div class="bg-primary-500 group-hover:bg-primary-600 relative h-4 w-4 rounded-full">
                <div class="absolute top-1 left-1 h-2 w-2 rounded-full bg-green-500"></div>
                <div class="absolute top-1 left-1 h-2 w-2 animate-ping rounded-full bg-emerald-500"></div>
              </div>
              <p class="text-xs">Transcribing • 00:03:42</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <button class="border border-neutral-300 px-4 h-10 rounded-md flex items-center justify-center gap-2">
              <i class="pi pi-share-alt"></i>
              Share
            </button>
            <button class="bg-blue-500 px-4 h-10 text-white rounded-md flex items-center justify-center gap-2">
              <i class="pi pi-play"></i>
              Listen
            </button>
          </div>
        </div>
        <div class="flex gap-4">
          <div class="flex flex-col gap-4 flex-1">
            <div class="border border-neutral-300 rounded-md p-4">
              <div class="flex justify-between">
                <div>
                  <p class="font-semibold">Live Transcription</p>
                  <p class="text-xs text-neutral-600 mb-4">
                    Champaign County EMS
                  </p>
                </div>
                <div class="flex gap-4 mt-1">
                  <div>
                    <input
                      type="text"
                      placeholder="Search transcript..."
                      class="border border-neutral-300 py-[3px] px-3 rounded-md"
                    />
                  </div>
                  <div class="flex gap-2">
                    <button class="border border-neutral-300 rounded-md w-8 h-8 flex items-center justify-center">
                      <i class="pi pi-filter"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div class="flex gap-4 text-sm mb-4 pb-4 border-b border-b-neutral-100">
                <div>
                  <div class="bg-neutral-100 px-2 py-1 rounded-md">
                    <i class="pi pi-play text-blue-500 text-xs"></i> • 3:42 PM
                  </div>
                </div>
                <div class="flex-1">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam vitae dui vel nunc ultrices viverra dignissim in sem.
                  Ut magna velit, lacinia eu tellus vitae, pellentesque sagittis
                  lorem. In gravida eleifend nibh quis aliquet. Donec sodales
                  quam nisl, eu tempor lorem feugiat at. Ut quis justo gravida,
                  vestibulum elit in, facilisis nisi. Mauris at nisl feugiat,
                  dignissim erat a, suscipit urna. Morbi ultricies pulvinar
                  sagittis. Nunc quis commodo eros. Quisque accumsan vehicula
                  quam nec sollicitudin.
                </div>
              </div>
              <div class="flex gap-4 text-sm">
                <div>
                  <div class="bg-neutral-100 px-2 py-1 rounded-md">
                    <i class="pi pi-play text-blue-500 text-xs"></i> • 3:42 PM
                  </div>
                </div>
                <div class="flex-1">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam vitae dui vel nunc ultrices viverra dignissim in sem.
                  Ut magna velit, lacinia eu tellus vitae,
                  <span class="inline-block bg-yellow-100 text-yellow-700 px-1 rounded-md">
                    pellentesque
                  </span>
                  sagittis lorem. In gravida eleifend nibh quis aliquet. Donec
                  sodales quam nisl, eu tempor lorem feugiat at. Ut quis justo
                  gravida, vestibulum elit in, facilisis nisi. Mauris at nisl
                  feugiat, dignissim erat a, suscipit urna. Morbi ultricies
                  pulvinar sagittis. Nunc quis commodo eros. Quisque accumsan
                  vehicula quam nec sollicitudin.
                  <div class="text-neutral-400 inline-flex items-center gap-2 ml-2">
                    <div class="flex items-center">
                      <i class="pi pi-clock mr-1 text-[12px]"></i> 2 secs
                    </div>
                    •
                    <div class="flex items-center">
                      <i class="pi pi-tag mr-1 text-[12px]"></i> hit and run
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-4 w-96">
            <div class="border border-neutral-300 rounded-md p-4">
              <p class="font-semibold">Events</p>
              <p class="text-xs text-neutral-600 mb-4">Last 3 days</p>
              <button class="flex w-full text-left items-center gap-4 text-sm mb-2">
                <div class="flex-1">Hit & Run - Neil & Green</div>
                <div>
                  <div class="bg-neutral-100 px-2 py-1 rounded-md">3:42 PM</div>
                </div>
              </button>
              <button class="flex w-full text-left items-center gap-4 text-sm mb-2">
                <div class="flex-1">Injuries reported - University Ave</div>
                <div>
                  <div class="bg-neutral-100 px-2 py-1 rounded-md">3:42 PM</div>
                </div>
              </button>
              <button class="flex w-full text-left items-center gap-4 text-sm mb-2">
                <div class="flex-1">Ambulance requested - Prospect</div>
                <div>
                  <div class="bg-neutral-100 px-2 py-1 rounded-md">3:42 PM</div>
                </div>
              </button>
              <button class="flex w-full text-left items-center gap-4 text-sm">
                <div class="flex-1">Shots fired - Campus District</div>
                <div>
                  <div class="bg-neutral-100 px-2 py-1 rounded-md">3:42 PM</div>
                </div>
              </button>
            </div>
            <div class="border border-neutral-300 rounded-md p-4">
              <p class="font-semibold">Notifications</p>
              <p class="text-xs text-neutral-600 mb-4">
                Get notified of events
              </p>
              <div>
                <div class="bg-blue-500 inline-flex items-center py-1 px-2 rounded-md text-xs text-white">
                  <i class="pi pi-tag mr-1 text-[12px]"></i> hit and run
                  <i class="pi pi-times ml-1 text-[8px]"></i>
                </div>
                <div class="bg-blue-500 inline-flex items-center py-1 px-2 rounded-md text-xs text-white">
                  <i class="pi pi-tag mr-1 text-[12px]"></i> hit and run
                  <i class="pi pi-times ml-1 text-[8px]"></i>
                </div>
                <div class="border border-neutral-300 inline-flex items-center py-1 px-2 rounded-md text-xs">
                  <i class="pi pi-tag mr-1 text-[12px]"></i> add tag
                </div>
              </div>
            </div>
            <div class="border border-neutral-300 rounded-md p-4">
              <p class="font-semibold">Activity</p>
              <p class="text-xs text-neutral-600">Peak radio traffic</p>
              <img src="graph.png" />
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
