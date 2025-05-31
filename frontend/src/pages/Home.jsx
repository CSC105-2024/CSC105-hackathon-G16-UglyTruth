import React from 'react';
import SideBar from '../components/SideBar';
import PostCard from '../components/PostCard';

const Home = () => {

const presetTags = [
  "Love", "Friends", "Family", "School", "Work",
  "Money", "Health", "Society", "Internet", "Loss", "Self", "Other"
];

const mockPosts = [
  {
    id: 1,
    title: "Overwhelmed by School",
    content: "I’m feeling overwhelmed with school. Too much to do, too little time. I just need a break. I’m feeling overwhelmed with school. Too much to do, too little time. I just need a break. I’m feeling overwhelmed with school. Too much to do, too little time. I just need a break. I’m feeling overwhelmed with school. Too much to do, too little time. I just need a break. ",
    tag: presetTags[3], // "School"
    warning: true,
    views: 42,
    likes: 15,
  },
  {
    id: 2,
    title: "Simple Joys with Friends",
    content: "Had an amazing day with friends—it's the little things that count! Had an amazing day with friends—it's the little things that count! Had an amazing day with friends—it's the little things that count! Had an amazing day with friends—it's the little things that count! Had an amazing day with friends—it's the little things that count!",
    tag: presetTags[1], // "Friends"
    views: 58,
    likes: 22,
  },
  {
    id: 3,
    title: "Work Stress Again",
    content: "Work stress is piling up again. Just needed to let it out anonymously. Work stress is piling up again. Just needed to let it out anonymously. Work stress is piling up again. Just needed to let it out anonymously. Work stress is piling up again. Just needed to let it out anonymously.",
    tag: presetTags[4], // "Work"
    views: 30,
    likes: 9,
  },
];


  return (
    <div className="flex h-screen w-screen bg-midnight text-cream font-nunito">
      {/* Sidebar */}
      <div className="w-[320px] shrink-0">
        <SideBar />
      </div>

      {/* Main content area */}
      <div className="flex-1 min-w-0 p-6 sm:p-8 lg:p-10 flex flex-col gap-6">
        {/* Header and search */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="text-4xl font-pica">HOME</h1>
          <div className="relative w-full sm:w-1/2">
            <input
              type="text"
              placeholder="Search post ..."
              className="w-full px-4 py-2 rounded-full bg-midnight border border-cream text-cream placeholder-cream focus:outline-none"
            />
            <div className="absolute right-3 top-2">🔽</div>
          </div>
        </div>

        {/* Content and filters */}
        <div className="flex flex-col lg:flex-row gap-6 overflow-auto">
          {/* Posts Section */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
            {mockPosts.map((post) => (
                <PostCard
                    key={post.id}
                    title={post.title}
                    tag={post.tag}
                    warning={post.warning}
                    content={post.content}
                    likes={post.likes}
                    views={post.views}
                />
            ))}
        </div>



          {/* Sidebar Tags and Meter */}
          <div className="w-full lg:w-[260px] flex flex-col gap-4">
            <div className="bg-sage rounded-xl border border-cream p-4">
              <h2 className="font-bold mb-2 text-xl">Post left Today</h2>
              <div className="flex items-center gap-2 text-lg">
                <span>0</span>
                <div className="flex-1 h-3 bg-midnight rounded-full overflow-hidden">
                  <div className="bg-cream h-full w-[40%]" />
                </div>
                <span>5</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                "Home", "Love", "Friends", "Family", "School", "Work",
                "Money", "Health", "Society", "Internet", "Loss", "Self", "Other"
              ].map(tag => (
                <button
                  key={tag}
                  className="bg-cream text-midnight font-semibold px-3 py-1 rounded-full text-sm hover:bg-opacity-80"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
