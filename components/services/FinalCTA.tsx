// services/FinalCTA.tsx
export default function FinalCTA() {
    return (
        <div className="card bg-base-100 border border-base-300 shadow-md text-center mt-12">
            <div className="card-body space-y-3">
                <h3 className="text-xl md:text-2xl font-extrabold">
                    Ready to start your project?
                </h3>
                <p className="text-base-content  max-w-xl mx-auto text-sm md:text-base">
                    Let’s discuss your needs and figure out the right solution for your business.
                </p>
                <a href="#contact" className="btn btn-secondary rounded-full normal-case">
                    Get a Free Consultation
                </a>
            </div>
        </div>
    );
}
