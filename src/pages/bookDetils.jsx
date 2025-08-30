import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { BookCard } from "../components/BookCard"
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  ArrowLeft,
  ArrowRight,
  Truck,
  Shield,
  RotateCcw,
  Plus,
  Minus,
  Search,
  Facebook,
  Twitter,
  Linkedin,
  Instagram
} from "lucide-react"
import bookCover1 from "../assets/images/books/book-cover-1.jpg"
import bookCover2 from "../assets/images/books/book-cover-2.jpg"
import bookCover3 from "../assets/images/books/book-cover-3.jpg"
import bookCover4 from "../assets/images/books/book-cover-4.jpg"
import bookCover5 from "../assets/images/books/book-cover-5.jpg"
import bookCover6 from "../assets/images/books/book-cover-6.jpg"

const booksData = [
  {
    id: "1",
    title: "Goodbye Again",
    author: "D'Khari Mills",
    price: 289.38,
    originalPrice: null,
    rating: 4.5,
    reviews: 5,
    reviewCount: "5 reviews",
    image: bookCover1,
    description: "Laboriosam unde deserunt ducimus ut ducimus soluta. Aperiam voluptas dicta at. Pariatur inventore recusandae nihil in dicta error expedita. Rerum provident et temporibus ut.",
    fullDescription: "Officia doloremque a corporis ipsa blanditiis. Sit ut nemo repellendus labore. Est voluptas molestias et recusandae. Ut voluptatibus odio dolor asperiores soluta eos laudantium. Quasi sit animi quam cum ea ea facere. Quas dicta maxime quo eligendi enim. Id enim architecto voluptatum tenetur eveniet quo. Debitis sunt similique nisi aut qui. Repellendus magni tempore consequatur autem.",
    pages: 342,
    publisher: "Adventure Books Ltd",
    language: "English",
    isbn: "978-0-123456-78-9",
    publishDate: "2024",
    sku: "48232333",
    weight: "106 kg",
    dimensions: "150 × 149 × 51 cm",
    inStock: true,
    stockStatus: "Available on backorder",
    categories: ["Animals"],
    tags: ["Books", "Fiction", "Romance - Contemporary"],
    nextProduct: {
      title: "The Bear of Byzantium",
      price: 171.00,
      image: bookCover2,
      id: "2"
    }
  },
]

const reviews = [
  {
    id: 1,
    author: "Join Hiddleston",
    rating: 3,
    date: "February 15, 2022",
    comment: "I am 6 feet tall and 220 lbs. This shirt fit me perfectly in the chest and shoulders. My only complaint is that it is so long! I like to wear polo shirts untucked. This shirt goes completely past my rear end. If I wore it with ordinary shorts, you probably wouldnt be able to see the shorts at all – completely hidden by the shirt. It needs to be 4 to 5 inches shorter in terms of length to suit me. I have many RL polo shirts, and this one is by far the longest. I dont understand why."
  },
  {
    id: 2,
    author: "Kenneth R. Myers",
    rating: 5,
    date: "February 15, 2022",
    comment: "The shirt was not the fabric I believed it to be. It says Classic Fit but was made like the older versions, not the soft cotton like my others. I don't understand how the labels are the same but a completely different shirt. Oh well, stuck with it now."
  },
  {
    id: 3,
    author: "Mike Addington",
    rating: 5,
    date: "February 15, 2022",
    comment: "Real authentic genuine quality however it fit me like an XL size when In fact Im L. Beware"
  },
  {
    id: 4,
    author: "Ervin Arlington",
    rating: 5,
    date: "February 15, 2022",
    comment: "The Ralph Lauren quaility is here in abundance. My husband always says that the Lauren polos fit better and last longer than any other brand.I love the new \"heathered\" color and the price is always excellent through shop"
  },
  {
    id: 5,
    author: "Patrick M. Newman",
    rating: 4,
    date: "February 15, 2022",
    comment: "My son loved this Jacket for his Senior Prom… He got sooo many compliments! He is slim build 5'11 and 150lbs … I ordered a large … it was a little big … but it was fine!"
  }
]

const relatedBooks = [
  {
    id: "2",
    title: "The Demonslayer",
    author: "Ernesto Wade",
    price: 414.10,
    rating: 3.5,
    reviews: 5,
    image: bookCover2
  },
  {
    id: "3",
    title: "Feral: Shadow Bred: Book 3",
    author: "Randal Adkins",
    price: 938.78,
    rating: 3.5,
    reviews: 5,
    image: bookCover3
  },
  {
    id: "4",
    title: "Vampire Sire 2",
    author: "Rex Rios",
    price: 642.94,
    rating: 4.25,
    reviews: 5,
    image: bookCover4
  },
  {
    id: "5",
    title: "Christmas Short Stories to read For Kids",
    author: "Warren Graham",
    price: 741.23,
    rating: 4.0,
    reviews: 5,
    image: bookCover5
  },
  {
    id: "6",
    title: "His Saving Grace",
    author: "Misty Figueroa",
    price: 201.00,
    rating: 4.5,
    reviews: 5,
    image: bookCover6
  },
  {
    id: "7",
    title: "Her Final Goodbye",
    author: "Jessica Munoz",
    price: 489.44,
    rating: 4.25,
    reviews: 5,
    image: bookCover1
  }
]

export default function BookDetail() {
  const { id } = useParams()
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("reviews")
  
  const book = booksData[0] // Using first book as default

  const handleAddToCart = () => {
    console.log(`Adding ${quantity} copies of book ${book.id} to cart`)
  }

  const handleAddToWishlist = () => {
    console.log("Adding book to wishlist:", book.id)
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "fill-primary text-primary"
            : "text-muted-foreground"
        }`}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Gallery */}
          <div className="space-y-4">
            <div className="relative group">
              <div className="aspect-[3/4] relative overflow-hidden rounded-lg bg-surface">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-4 right-4 bg-background/80 hover:bg-background p-2 rounded-full transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Top Section */}
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Badge variant="secondary" className="text-xs font-medium">
                  <span className="mr-1">Availability:</span>
                  {book.inStock ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>
              
              {/* Product Navigation */}
              {book.nextProduct && (
                <div className="flex items-center gap-2">
                  <Link 
                    to={`/book/${book.nextProduct.id}`}
                    className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-secondary transition-colors group"
                  >
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Next</div>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="flex items-center gap-2">
                      <img
                        src={book.nextProduct.image}
                        alt={book.nextProduct.title}
                        className="w-12 h-16 object-cover rounded"
                      />
                      <div className="text-left">
                        <div className="text-sm font-medium line-clamp-1">{book.nextProduct.title}</div>
                        <div className="text-sm text-price font-semibold">${book.nextProduct.price}</div>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Title & Author */}
            <div className="space-y-3">
              <h1 className="text-3xl font-bold">{book.title}</h1>
              <div className="text-muted-foreground">
                Author: <Link to="#" className="text-primary hover:underline">{book.author}</Link>
              </div>
              
              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {renderStars(book.rating)}
                  <span className="text-sm text-muted-foreground ml-1">
                    Rated {book.rating} out of 5
                  </span>
                </div>
                <Link to="#reviews" className="text-sm text-primary hover:underline">
                  <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                    {book.reviews}
                  </span>
                </Link>
              </div>

              <div className="text-sm text-muted-foreground">
                SKU: <span className="text-foreground">{book.sku}</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="text-3xl font-bold text-price">
                ${book.price.toFixed(2)}
              </div>
            </div>

            {/* Description */}
            <div className="text-muted-foreground">
              {book.description}
            </div>

            {/* Stock Status */}
            <div className="text-sm text-muted-foreground">
              {book.stockStatus}
            </div>

            {/* Add to Cart Form */}
            <div className="space-y-4 border-t border-border pt-6">
              <div className="flex items-center gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantity</label>
                  <div className="flex items-center border border-border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-secondary transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center py-2 bg-transparent border-0 focus:outline-none"
                      min="1"
                      max="999"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-secondary transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="cart"
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                >
                  Add to cart
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleAddToWishlist}
                >
                  Add to wishlist
                </Button>
              </div>
            </div>

            {/* Product Meta */}
            <div className="space-y-2 text-sm border-t border-border pt-6">
              <div>
                <span className="text-muted-foreground">Category: </span>
                {book.categories.map((cat, index) => (
                  <span key={cat}>
                    <Link to="#" className="text-primary hover:underline">{cat}</Link>
                    {index < book.categories.length - 1 && ", "}
                  </span>
                ))}
              </div>
              <div>
                <span className="text-muted-foreground">Tags: </span>
                {book.tags.map((tag, index) => (
                  <span key={tag}>
                    <Link to="#" className="text-primary hover:underline">{tag}</Link>
                    {index < book.tags.length - 1 && ", "}
                  </span>
                ))}
              </div>
            </div>

            {/* Social Share */}
            <div className="flex items-center gap-4 border-t border-border pt-6">
              <span className="text-sm font-medium">Share:</span>
              <div className="flex items-center gap-3">
                <Link to="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Facebook className="w-4 h-4" />
                  <span>Facebook</span>
                </Link>
                <Link to="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Twitter className="w-4 h-4" />
                  <span>Twitter</span>
                </Link>
                <Link to="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </Link>
                <Link to="#" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Instagram className="w-4 h-4" />
                  <span>Pinterest</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="border-t border-border">
          <div className="flex gap-8 border-b border-border">
            {[
              { key: "description", label: "Description" },
              { key: "additional", label: "Additional information" },
              { key: "reviews", label: `Reviews (${book.reviews})` }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === "description" && (
              <div className="max-w-3xl space-y-4">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <div className="prose text-muted-foreground leading-relaxed space-y-4">
                  {book.fullDescription.split('. ').map((sentence, index) => (
                    <p key={index}>{sentence}{index < book.fullDescription.split('. ').length - 1 ? '.' : ''}</p>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === "additional" && (
              <div className="max-w-3xl">
                <h2 className="text-xl font-semibold mb-6">Additional information</h2>
                <div className="border border-border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 bg-muted font-medium w-1/3">Weight</th>
                        <td className="py-3 px-4">{book.weight}</td>
                      </tr>
                      <tr>
                        <th className="text-left py-3 px-4 bg-muted font-medium">Dimensions</th>
                        <td className="py-3 px-4">{book.dimensions}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {activeTab === "reviews" && (
              <div className="max-w-4xl space-y-8">
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">
                    {book.reviews} reviews for <span className="text-primary">{book.title}</span>
                  </h2>
                  
                  {/* Reviews List */}
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="flex gap-4 p-6 border border-border rounded-lg">
                        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium">
                            {review.author.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-1">
                            {renderStars(review.rating)}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium">{review.author}</span>
                            <span className="text-muted-foreground">–</span>
                            <span className="text-muted-foreground">{review.date}</span>
                          </div>
                          <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Review Form */}
                  <div className="border-t border-border pt-8">
                    <h3 className="text-lg font-semibold mb-6">Add a review</h3>
                    <form className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Your rating <span className="text-destructive">*</span>
                        </label>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              <Star className="w-5 h-5" />
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <textarea
                          placeholder="Your review *"
                          rows={6}
                          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Name *"
                          className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <input
                          type="email"
                          placeholder="Email *"
                          className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <input type="checkbox" id="save-info" className="mt-1" />
                        <label htmlFor="save-info" className="text-sm text-muted-foreground">
                          Save my name, email, and website in this browser for the next time I comment.
                        </label>
                      </div>
                      
                      <Button type="submit" variant="default">
                        Submit
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <section className="py-16">
          <h2 className="text-2xl font-bold mb-8">Related products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {relatedBooks.map((relatedBook) => (
              <BookCard
                key={`related-${relatedBook.id}`}
                {...relatedBook}
                onAddToCart={() => console.log("Adding to cart:", relatedBook.id)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}