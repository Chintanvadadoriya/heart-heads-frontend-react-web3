const GoldTier = () => {
  return (
    <ul style={{ listStyleType: "disc" }}>
      <li>
        <strong>God Tier: </strong> Only 1 item available.
      </li>
      <li>
        <strong>Legendary: </strong> 2-10 items.
      </li>
      <li>
        <strong>Ultra Rare: </strong> 11-100 items.
      </li>
      <li>
        <strong>Rare: </strong> 101-1000 items.
      </li>
      <li>
        <strong>Common: </strong> 1001-5555 items.
      </li>
    </ul>
  );
};

const HeartHeadCommunity = () => {
  return (
    <>
      <p>
        Getting involved in the Heart Heads community is a fantastic way
        to enhance your NFT experience and connect with fellow
        collectors. Here are some ways to become an active part of our
        community:
      </p>
      <ol>
        <li>
          <p>
            Join Social Media: Follow our official social media
            accounts on platforms like:
          </p>
          <ul style={{ listStyleType: "disc" }}>
            <li>
              Heart Heads Telegram: Join our Telegram group to engage
              in real-time discussions, receive updates, and
              connect with the Heart Heads community.
            </li>
            <li>
              Heart-Heads Twitter: Stay updated with the latest
              news and announcements by following our official
              Twitter account.
            </li>
            <li>
              X Spaces: Participate in the X Spaces community to
              explore and discuss Heart Heads in a broader
              context.
            </li>
          </ul>
        </li>
        <li>
          Attend Community Events: Keep an eye out for
          community-hosted events, AMAs (Ask Me Anything), giveaways,
          and contests. Participating in these activities can be both
          fun and rewarding.
        </li>
        <li>
          Contribute Creatively: If you're artistically inclined,
          consider creating fan art or fan content related to Heart
          Heads. Sharing your creations with the community can be a
          great way to connect with like-minded individuals.
        </li>
        <li>
          Collaborate: Explore opportunities to collaborate with other
          collectors or artists within the Heart Heads community.
          Joint projects and partnerships can lead to exciting
          creations.
        </li>
        <li>
          Stay Informed: Regularly visit the Heart Heads website and
          community channels to stay informed about new features,
          updates, and events.
        </li>
        <li>
          Support Fellow Collectors: Encourage and support other
          collectors by engaging positively in discussions, sharing
          your insights, and helping newcomers navigate the world of
          Heart Heads.
        </li>
        <li>
          Suggest Improvements: Your feedback is invaluable. Feel free
          to suggest improvements, new features, or ideas that can
          enhance the Heart Heads experience for everyone.
        </li>
      </ol>
      <p>
        Remember, the Heart Heads community is all about creativity,
        collaboration, and inclusivity. We welcome collectors and
        enthusiasts of all backgrounds, and we look forward to having
        you as an active member of our vibrant community!
      </p>
    </>
  );
};

const AreNFTsJustJPEGs = () => {
  return (
    <>
      <p>
        Heart Heads images are securely stored on IPFS, eliminating
        concerns related to server downtime or unauthorized alterations.
        IPFS, which stands for the InterPlanetary File System, provides
        a decentralized and immutable platform for hosting digital
        assets.
      </p>

      <p>IPFS plays a crucial role in our NFT ecosystem:</p>
      <ol>
        <li>
          Decentralized Storage: IPFS provides decentralized and
          distributed storage for the digital assets associated with
          NFTs. This means that copies of the artwork file are stored
          on multiple nodes across the IPFS network, making it
          resistant to censorship and data loss. Artists and creators
          can rely on IPFS to host their digital assets in a way that
          is not dependent on a single centralized server.
        </li>
        <li>
          Immutable Content: Once you upload a digital asset to IPFS
          and it receives a cryptographic hash, the content becomes
          immutable. This means that the content of the artwork cannot
          be changed or tampered with without changing the
          cryptographic hash. This immutability ensures that the
          integrity of the digital asset is maintained, which is
          essential for the provenance of NFTs.
        </li>
        <li>
          Decentralized Links: NFT smart contracts often include a
          link or reference to the IPFS-hosted content. This link is
          stored on the blockchain and serves as a reference to the
          immutable digital asset on IPFS. Even if the link to the
          IPFS content is publicly accessible, it cannot be altered or
          redirected without making changes on the blockchain, which
          is a decentralized and consensus-driven process.
        </li>
      </ol>
      <p>
        In summary, IPFS is a powerful tool for hosting and providing
        access to the digital assets associated with NFTs. It ensures
        decentralization, immutability, and reliability of the content,
        which are critical aspects of maintaining the uniqueness and
        provenance of NFTs, whether they represent digital art, music,
        or any other digital item.
      </p>
    </>
  );
};

export const FAQS = [
  {
    question: 'What are Heart Heads?',
    answer: (
      <>
        <p>
          Heart Heads are a unique and innovative collection of NFTs that have been crafted with meticulous attention to
          detail. Unlike traditional NFTs, A Heart Head is not just a single token; it's a composition of multiple
          elements, each contributing to its uniqueness.
        </p>
        <p>
          {' '}
          What makes Heart Heads truly exceptional is the ability to mix and match these elements. You can equip your
          Heart Head with different backgrounds, hats, necklaces, clothes, sunglasses, and earrings to compose a truly
          unique and personalized character. This level of customization allows for endless possibilities, ensuring that
          each Heart Head is one-of-a-kind.
        </p>
      </>
    )
  },
  {
    question: 'What Happens After I Mint My Heart Head?',
    answer: (
      <>
        <p>
          What Happens After I Mint My Heart Head? A Heart Head is a unique digital collectible created by permanently
          minting selected items together. Once minted, there's no way to modify it, so choose your items carefully. In
          the future, Heart Heads can be upgraded to version 2 (v2) using the erc-6220 standard, allowing you to add or
          remove items. You can trade composed Heart Heads or single items on any PulseChain marketplace. Consider your
          item choices wisely, as there's no going back once minted.
        </p>
      </>
    )
  },
  {
    question: 'Are NFTs Just JPEGs Loosely Related to Serial Numbers?',
    answer: <AreNFTsJustJPEGs />
  },
  {
    question: 'How do I Mint Heart Heads NFTs?',
    answer: (
      <>
        Hearts can only be minted from Heart-Heads.com, ensuring a secure and authentic minting process. We
        want to emphasize that there has been no pre-minting; Heart Heads are entirely community-owned.
      </>
    )
  },

  {
    question: 'What Are The Minting Tiers?',
    answer: (
      <>
        <ul style={{ listStyleType: 'disc' }}>
          <li>Tier 1: For the first 0-32% of the collection, each NFT is priced at 150K PLS.</li>
          <li>Tier 2: From 33% to 66% of the collection, NFTs are available at a rate of 250K PLS each.</li>
          <li>
            Tier 3: During the final stretch, from 67% to 100% of the collection, NFTs are priced at 350K PLS each.
          </li>
        </ul>
      </>
    )
  },
  {
    question: 'ERC-6220 NFT’s?',
    answer: (
      <>
        <p>
          Composable NFTs represent an evolution of the ERC-721 standard, introducing the Equippable Parts Standard.
          This innovation allows NFTs to transform themselves by adding distinct parts.
        </p>
        <p>
          With Composable NFTs, you have the flexibility to create unique tokens by selecting parts from a catalog.
          Additionally, these NFTs can seamlessly equip other NFTs into predefined slots provided within the catalog.
        </p>
        <p>
          The catalog consists of two types of parts: Slot-Type Parts and Fixed-Type Parts. Slot-Type Parts enable you
          to equip other NFT collections, paving the way for countless creative combinations. On the other hand,
          Fixed-Type Parts are standalone components with their own unique metadata, offering ready-made enhancements
          for your NFTs.
        </p>
        <p>
          One of the standout features is that equipping a part doesn't generate a new token; instead, it enriches the
          visual representation of your NFT. Composable NFTs empower you to craft digital masterpieces limited only by
          your imagination, ushering in a new era of NFT creativity.
        </p>
      </>
    )
  },
  {
    question: 'ERC-6059?',
    answer: (
      <>
        <p>
          The Parent-Governed Nestable NFT standard is a significant extension of ERC-721, introducing a novel approach
          to inter-NFT relationships and interactions.
        </p>
        <p>
          At its core, this proposal simplifies the concept: NFT ownership is not limited to Externally Owned Accounts
          (EOAs) or smart contracts; it can also include ownership by another NFT.
        </p>
        <p>
          The process of nesting one NFT within another closely resembles the act of transferring it to another user.
          This involves issuing a transaction from the account that owns the parent token.
        </p>
        <p>
          An NFT can be owned by a single other NFT, yet simultaneously have ownership of multiple NFTs. This proposal
          establishes the foundational framework for parent-child relationships among NFTs. A parent token is one that
          possesses ownership of another token, while a child token is an NFT owned by another token. Notably, a token
          can assume the roles of both parent and child simultaneously. Child tokens under a given token can be fully
          managed by the owner of the parent token, although proposals for changes can be submitted by anyone.
        </p>
        <p>
          In essence, the Parent-Governed Nestable NFT standard fosters a dynamic ecosystem of interconnected NFTs,
          allowing for versatile ownership structures and interactions within the NFT space.
        </p>
      </>
    )
  },
  {
    question: 'Why should I collect NFTs from Heart Heads?',
    answer: (
      <>
        <p>
          Collecting NFTs from Heart Heads offers a unique and rewarding experience for several compelling reasons.
          First and foremost, Heart Heads provide an unparalleled canvas for creativity, allowing you to customize
          digital characters with a wide array of parts and accessories, making each NFT truly one-of-a-kind.
        </p>
        <p>
          What sets Heart Heads apart is our community-driven approach; our collection is 100% community-owned,
          fostering a sense of shared ownership and involvement.
        </p>
        <p>
          Our innovative use of the ERC-721 standard introduces future capabilities, elevating NFT interactions to new
          heights. These NFTs are futureproof, allowing for further possibilities such as upgrades, rewards, token-gated
          features, achievements, gaming integration, and DASO (Decentralized Autonomous Social Organization)
          membership.
        </p>
        <p>
          By collecting Heart Heads, you're not only supporting digital art but also contributing to the growth and
          development of the NFT community. Trust, transparency, and a commitment to community values are at the core of
          the Heart Heads experience, making it a compelling choice for NFT collectors.
        </p>
      </>
    )
  },
  {
    question: 'Which Blockchain are Heart Heads On?',
    answer: (
      <>
        Heart Heads are exclusively hosted on the PulseChain blockchain. However, it's worth noting that there is the
        potential for wrapping Heart Heads and having them available on multiple blockchains in the future. This
        possibility opens up exciting opportunities for cross-chain compatibility and accessibility, which may become a
        feature as the Heart Heads collection evolves.
      </>
    )
  },
  {
    question: 'Are Heart Heads NFTs limited in supply?',
    answer: (
      <>
        <p>
          Yes, Heart Heads NFTs are indeed limited in supply. The collection consists of a finite number of items to
          maintain their rarity and exclusivity. Specifically, there are a total of 5555 base images, 5555 backgrounds,
          5555 hats, 5555 sunglasses, 5555 earrings, 5555 clothes, and 5555 necklaces. In total, this adds up to 38,885
          unique items within the collection.
        </p>
        <p>
          Each category of items, including backgrounds, base images, clothes, earrings, hats, necklaces, and
          sunglasses, has its own specific quantity, which plays a crucial role in determining the rarity of each item.
          This limited supply and the variation in quantities among different item categories contribute to the rarity
          and uniqueness of Heart Heads NFTs, making them highly sought after by collectors and enthusiasts.
        </p>
      </>
    )
  },
  {
    question: 'What are the rarity levels in Heart Heads?',
    answer: <GoldTier />
  },
  {
    question: 'Can I showcase my Heart Heads NFTs in virtual galleries or metaverse environments?',
    // answer: "Subject to the support of ERC-6220 NFTs.",
    answer: 'Yes!'
  },
  {
    question: 'Can I trade or sell my Heart Heads NFTs?',
    answer: 'Indeed, each item can be individually traded on the Hex Toys marketplace.'
  },
  {
    question: 'What happens if I receive a duplicate item?',
    answer: 'You have the option to trade it for another item you desire, or you can choose to hold onto it!'
  },
  {
    question: 'What is the best way to contact Heart Heads support?',
    answer: 'To contact support, please message us on X.com/heart_heads'
  },
  {
    question: 'How do I view my Heart Heads NFTs in my wallet?',
    answer:
      'To view your items, simply connect your wallet and explore your collection of composed Heart Heads and inventory. Please note that most wallets do not currently support the ERC-62220 standard natively; support is expected to be available at a later date.'
  },
  {
    question: 'What is the resale value of Heart Heads NFTs?',
    answer:
      "The resale value of Heart Heads NFTs can vary depending on factors such as rarity, demand, and the overall popularity of the collection. While some Heart Heads NFTs, particularly those in rarer categories, may have higher resale values, it's essential to keep in mind that the NFT market is dynamic and can fluctuate. As the Heart Heads community grows and more features are introduced, the resale value of these NFTs may evolve. Engaging with the Heart Heads community, staying informed about updates, and monitoring the market can help you make informed decisions about buying, holding, or selling your NFTs."
  },
  {
    question: 'How can I get involved in the Heart Heads community?',
    answer: <HeartHeadCommunity />
  },
  {
    question: 'Will there be new items added to the Heart Heads Collection?',
    answer:
      "Yes, there will be opportunities to see new items added to the Heart Heads Collection. While the quantities of existing items can never be changed, we're excited to introduce new and seasonal items to keep the collection fresh and engaging. For instance, you might find special items like a Santa's hat during the holiday season. These new additions could be part of competitions, exclusive drops, or even straightforward minting events on a first-come, first-serve basis. We're committed to bringing you exciting updates and surprises, so stay tuned for future releases and events within the Heart Heads Collection!"
  },
  {
    question: 'What happens if I lose access to my wallet or NFTs?',
    answer:
      "Similar to other digital assets, maintaining ownership and access to your Heart Heads NFTs is crucial. If you lose access to your wallet, you will also lose access to your Heart Heads NFTs. It's essential to take precautions to safeguard your wallet and ensure you have secure backup mechanisms in place to prevent any unfortunate loss of access to your valuable NFT collection. Be sure to follow best practices for wallet security to protect your assets effectively."
  },
  {
    question: 'Are there any future plans or updates for Heart Heads?',
    answer:
      "While we have no specific expectations, the Heart Heads community is always full of exciting possibilities. We envision a future where Heart Heads NFTs could potentially feature rewards, upgrades, multi-asset capabilities, token-gated access for virtual or real-world experiences, achievements, gaming integration, and even the possibility of becoming part of a Decentralized Autonomous Organization (DAO). Our commitment to innovation and community-driven development means that we're open to exploring various avenues that can enhance your Heart Heads experience. Keep an eye on our updates and announcements for any exciting developments that may come your way!"
  }
  // {
  //     question:"",
  //     answer: "",
  // },
  // {
  //     question:"",
  //     answer: "",
  // },
];
